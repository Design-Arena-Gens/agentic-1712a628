'use client';

import { useCallback, useMemo, useState } from 'react';
import ConnectionForm from '../components/ConnectionForm';
import WorkflowBoard from '../components/WorkflowBoard.jsx';
import MixStepComposer from '../components/MixStepComposer.jsx';
import NodePreview from '../components/NodePreview.jsx';
import Toast from '../components/Toast.jsx';
import { n8nClient, mockCreateResponse, mockWorkflows } from '../lib/n8nClient';
import { buildWorkflowPayload, defaultSteps, generatePreviewNodes } from '../lib/mixTemplates';

const defaultDescription =
  'Orchestrate Mix payloads with n8n: hydrate analytics, sync downstream systems, and respond in milliseconds.';

const makeStep = (type = 'http') => ({
  id:
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `step-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  name: 'New Mix Step',
  type,
  config: {
    http: { method: 'GET', url: '', headers: [], query: [] },
    transform: {
      code: `return items.map(item => ({\n  json: {\n    ...item.json,\n  }\n}));`,
    },
    merge: { mode: 'combine', propertyName: 'id' },
    analytics: {
      conditions: {
        string: [
          {
            value1: '={{$json["event"]}}',
            operation: 'notEmpty',
          },
        ],
      },
    },
  }[type],
});

export default function Home() {
  const [connection, setConnection] = useState({
    baseUrl: '',
    apiKey: '',
    workflowName: 'Mix Integration Workflow',
    description: defaultDescription,
    triggerPath: 'mix/ingest',
    useMock: true,
  });

  const [status, setStatus] = useState('idle');
  const [workflows, setWorkflows] = useState([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [mixSteps, setMixSteps] = useState(defaultSteps);
  const [toast, setToast] = useState(null);
  const [toastTone, setToastTone] = useState('info');
  const [error, setError] = useState(null);
  const [isPublishing, setIsPublishing] = useState(false);

  const handleConnectionChange = useCallback((updated) => {
    setConnection(updated);
  }, []);

  const handleConnect = useCallback(async () => {
    setStatus('connecting');
    setError(null);
    try {
      if (connection.useMock) {
        await new Promise((resolve) => setTimeout(resolve, 320));
        setWorkflows(mockWorkflows);
        setSelectedWorkflow(mockWorkflows[0] || null);
        setStatus('connected');
        setToast('Mock workspace loaded. Explore templates freely.');
        setToastTone('info');
        return;
      }

      const results = await n8nClient.listWorkflows(connection);
      setWorkflows(results);
      setSelectedWorkflow(results[0] || null);
      setStatus('connected');
      setToast('Connected to n8n. Workspace synced successfully.');
      setToastTone('success');
    } catch (err) {
      console.error(err);
      setStatus('error');
      setError(err.message || 'Connection failed');
      setToast('Connection failed. Validate URL & API key.');
      setToastTone('error');
    }
  }, [connection]);

  const handleDisconnect = useCallback(() => {
    setStatus('idle');
    setWorkflows([]);
    setSelectedWorkflow(null);
    setToast('Disconnected from workspace.');
    setToastTone('warning');
  }, []);

  const handleSelectWorkflow = useCallback((workflow) => {
    setSelectedWorkflow(workflow);
  }, []);

  const handleAddStep = useCallback(() => {
    setMixSteps((previous) => previous.concat(makeStep('http')));
  }, []);

  const handleUpdateStep = useCallback((stepId, updatedStep) => {
    setMixSteps((previous) =>
      previous.map((step) => (step.id === stepId ? { ...step, ...updatedStep } : step)),
    );
  }, []);

  const handleRemoveStep = useCallback((stepId) => {
    setMixSteps((previous) => previous.filter((step) => step.id !== stepId));
  }, []);

  const handleDuplicateStep = useCallback((stepId) => {
    setMixSteps((previous) => {
      const index = previous.findIndex((step) => step.id === stepId);
      if (index === -1) return previous;
      const clone = previous[index];
      const duplicated = {
        ...clone,
        id: makeStep(clone.type).id,
        name: `${clone.name} (copy)`,
      };
      const next = previous.slice();
      next.splice(index + 1, 0, duplicated);
      return next;
    });
  }, []);

  const workflowPayload = useMemo(
    () =>
      buildWorkflowPayload({
        workflowName: connection.workflowName,
        description: connection.description,
        triggerPath: connection.triggerPath,
        mixSteps,
      }),
    [connection.workflowName, connection.description, connection.triggerPath, mixSteps],
  );

  const previewNodes = useMemo(() => generatePreviewNodes(mixSteps), [mixSteps]);

  const canPublish = mixSteps.length > 0;

  const handleCreateWorkflow = useCallback(async () => {
    setIsPublishing(true);
    try {
      let created;
      if (connection.useMock) {
        await new Promise((resolve) => setTimeout(resolve, 350));
        created = mockCreateResponse({
          name: workflowPayload.name,
          active: false,
          updatedAt: new Date().toISOString(),
          tags: ['mix', 'generated'],
        });
      } else {
        created = await n8nClient.createWorkflow(connection, workflowPayload);
      }

      setWorkflows((previous) => [created, ...previous]);
      setSelectedWorkflow(created);
      setToast('Workflow generated & published to n8n.');
      setToastTone('success');
    } catch (err) {
      console.error(err);
      setToast(err.message || 'Failed to publish workflow');
      setToastTone('error');
    } finally {
      setIsPublishing(false);
    }
  }, [connection, workflowPayload]);

  return (
    <main>
      <ConnectionForm
        connection={connection}
        status={status}
        error={error}
        onChange={handleConnectionChange}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
      />

      <WorkflowBoard
        workflows={workflows}
        selected={selectedWorkflow}
        onSelect={handleSelectWorkflow}
        status={status}
      />

      <MixStepComposer
        steps={mixSteps}
        onAddStep={handleAddStep}
        onUpdateStep={handleUpdateStep}
        onRemoveStep={handleRemoveStep}
        onDuplicateStep={handleDuplicateStep}
      />

      <NodePreview
        nodes={previewNodes}
        workflowPayload={workflowPayload}
        disabled={!canPublish}
        onCreate={handleCreateWorkflow}
        isSubmitting={isPublishing}
      />

      <Toast message={toast} tone={toastTone} onDismiss={() => setToast(null)} />
    </main>
  );
}
