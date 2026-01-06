function t(e){switch(e){case"index":return`---
title: "Software Factory - System Context"
---
graph TB
  Engineer[fa:fa-user Engineer]
  TeamLead[fa:fa-user Team Lead]
  Architect[fa:fa-user System Architect]
  Devops[fa:fa-user DevOps Engineer]
  Monitoring[Monitoring System]
  subgraph SoftwareFactory["Software Factory Platform"]
    SoftwareFactory.Dashboard[Dashboard UI]
    SoftwareFactory.OrchestrationEngine[Orchestration Engine]
    SoftwareFactory.ContextManager[Context Manager]
    SoftwareFactory.DataStore[Data Store]
    SoftwareFactory.AiRuntime[AI Agent Runtime]
  end
  BlueprintSystem[Blueprint Context System]
  AiProvider[AI Provider]
  GitRepo[Git Repository]
  Cicd[CI/CD Pipeline]
  TestFramework[Testing Framework]
  Engineer -. "Configures and monitors AI workflows" .-> SoftwareFactory.Dashboard
  TeamLead -. "Oversees autonomous development processes" .-> SoftwareFactory.Dashboard
  Architect -. "Designs workflow templates and quality gates" .-> SoftwareFactory.Dashboard
  Devops -. "Manages deployment configurations and monitoring" .-> SoftwareFactory.Dashboard
  Monitoring -. "Provides monitoring data" .-> SoftwareFactory.Dashboard
  SoftwareFactory.Dashboard -. "Sends workflow configurations" .-> SoftwareFactory.OrchestrationEngine
  SoftwareFactory.OrchestrationEngine -. "Orchestrates AI agent execution" .-> SoftwareFactory.AiRuntime
  SoftwareFactory.OrchestrationEngine -. "Accesses business context" .-> SoftwareFactory.ContextManager
  SoftwareFactory.OrchestrationEngine -. "Persists configurations and artifacts" .-> SoftwareFactory.DataStore
  SoftwareFactory.ContextManager -. "Provides technical specs" .-> SoftwareFactory.AiRuntime
  SoftwareFactory.OrchestrationEngine -. "Sends health and performance metrics" .-> Monitoring
  SoftwareFactory.AiRuntime -. "Executes AI-powered development tasks" .-> AiProvider
  SoftwareFactory.AiRuntime -. "Commits generated code" .-> GitRepo
  SoftwareFactory.AiRuntime -. "Triggers automated builds" .-> Cicd
  SoftwareFactory.AiRuntime -. "Runs autonomous testing" .-> TestFramework
  SoftwareFactory.ContextManager -. "Retrieves business context and requirements" .-> BlueprintSystem
`;case"containers":return`---
title: "Software Factory - Containers"
---
graph TB
  Engineer[fa:fa-user Engineer]
  TeamLead[fa:fa-user Team Lead]
  Architect[fa:fa-user System Architect]
  Devops[fa:fa-user DevOps Engineer]
  subgraph SoftwareFactory["Software Factory Platform"]
    SoftwareFactory.Dashboard[Dashboard UI]
    SoftwareFactory.OrchestrationEngine[Orchestration Engine]
    SoftwareFactory.ContextManager[Context Manager]
    SoftwareFactory.DataStore[Data Store]
    SoftwareFactory.AiRuntime[AI Agent Runtime]
  end
  Monitoring[Monitoring System]
  BlueprintSystem[Blueprint Context System]
  AiProvider[AI Provider]
  GitRepo[Git Repository]
  Cicd[CI/CD Pipeline]
  TestFramework[Testing Framework]
  SoftwareFactory.Dashboard -. "Sends workflow configurations" .-> SoftwareFactory.OrchestrationEngine
  SoftwareFactory.OrchestrationEngine -. "Orchestrates AI agent execution" .-> SoftwareFactory.AiRuntime
  SoftwareFactory.OrchestrationEngine -. "Accesses business context" .-> SoftwareFactory.ContextManager
  SoftwareFactory.OrchestrationEngine -. "Persists configurations and artifacts" .-> SoftwareFactory.DataStore
  SoftwareFactory.ContextManager -. "Provides technical specs" .-> SoftwareFactory.AiRuntime
  Engineer -. "Configures and monitors AI workflows" .-> SoftwareFactory.Dashboard
  TeamLead -. "Oversees autonomous development processes" .-> SoftwareFactory.Dashboard
  Architect -. "Designs workflow templates and quality gates" .-> SoftwareFactory.Dashboard
  Devops -. "Manages deployment configurations and monitoring" .-> SoftwareFactory.Dashboard
  SoftwareFactory.AiRuntime -. "Executes AI-powered development tasks" .-> AiProvider
  SoftwareFactory.AiRuntime -. "Commits generated code" .-> GitRepo
  SoftwareFactory.AiRuntime -. "Triggers automated builds" .-> Cicd
  SoftwareFactory.AiRuntime -. "Runs autonomous testing" .-> TestFramework
  SoftwareFactory.OrchestrationEngine -. "Sends health and performance metrics" .-> Monitoring
  Monitoring -. "Provides monitoring data" .-> SoftwareFactory.Dashboard
  SoftwareFactory.ContextManager -. "Retrieves business context and requirements" .-> BlueprintSystem
`;case"orchestrationComponents":return`---
title: "Orchestration Engine Components"
---
graph TB
  SoftwareFactoryDashboard[Dashboard UI]
  subgraph SoftwareFactoryOrchestrationEngine["Orchestration Engine"]
    SoftwareFactoryOrchestrationEngine.WorkflowOrchestrator[Workflow Orchestrator]
    SoftwareFactoryOrchestrationEngine.AgentCoordinator[Agent Coordinator]
    SoftwareFactoryOrchestrationEngine.QualityGate[Quality Gate]
    SoftwareFactoryOrchestrationEngine.DeploymentManager[Deployment Manager]
  end
  SoftwareFactoryContextManager[Context Manager]
  SoftwareFactoryAiRuntime[AI Agent Runtime]
  SoftwareFactoryDashboard -. "[...]" .-> SoftwareFactoryOrchestrationEngine.WorkflowOrchestrator
  SoftwareFactoryDashboard -. "Monitors agents" .-> SoftwareFactoryOrchestrationEngine.AgentCoordinator
  SoftwareFactoryOrchestrationEngine.WorkflowOrchestrator -. "Initiates development" .-> SoftwareFactoryAiRuntime
  SoftwareFactoryOrchestrationEngine.QualityGate -. "Triggers review" .-> SoftwareFactoryAiRuntime
  SoftwareFactoryOrchestrationEngine.DeploymentManager -. "Manages deployment" .-> SoftwareFactoryAiRuntime
  SoftwareFactoryContextManager -. "Provides technical specs" .-> SoftwareFactoryAiRuntime
  SoftwareFactoryOrchestrationEngine -. "Accesses business context" .-> SoftwareFactoryContextManager
`;case"aiAgents":return`---
title: "AI Agent Runtime Components"
---
graph TB
  subgraph SoftwareFactoryAiRuntime["AI Agent Runtime"]
    SoftwareFactoryAiRuntime.TestGenerator[Test Generator Agent]
    SoftwareFactoryAiRuntime.CodeGenerator[Code Generator Agent]
    SoftwareFactoryAiRuntime.ReviewerAgent[Code Review Agent]
    SoftwareFactoryAiRuntime.DeploymentAgent[Deployment Agent]
  end
  SoftwareFactoryOrchestrationEngine[Orchestration Engine]
  AiProvider[AI Provider]
  GitRepo[Git Repository]
  Cicd[CI/CD Pipeline]
  TestFramework[Testing Framework]
  SoftwareFactoryOrchestrationEngine -. "Initiates development" .-> SoftwareFactoryAiRuntime.CodeGenerator
  SoftwareFactoryOrchestrationEngine -. "Triggers review" .-> SoftwareFactoryAiRuntime.ReviewerAgent
  SoftwareFactoryOrchestrationEngine -. "Manages deployment" .-> SoftwareFactoryAiRuntime.DeploymentAgent
  SoftwareFactoryAiRuntime -. "Executes AI-powered development tasks" .-> AiProvider
  SoftwareFactoryAiRuntime -. "Commits generated code" .-> GitRepo
  SoftwareFactoryAiRuntime -. "Triggers automated builds" .-> Cicd
  SoftwareFactoryAiRuntime -. "Runs autonomous testing" .-> TestFramework
`;case"dashboardComponents":return`---
title: "Dashboard UI Components"
---
graph TB
  subgraph SoftwareFactoryDashboard["Dashboard UI"]
    SoftwareFactoryDashboard.BlueprintViewer[Blueprint Viewer]
    SoftwareFactoryDashboard.WorkflowDesigner[Workflow Designer]
    SoftwareFactoryDashboard.BacklogManager[Backlog Manager]
    SoftwareFactoryDashboard.MonitoringDashboard[Monitoring Dashboard]
  end
  Engineer[fa:fa-user Engineer]
  TeamLead[fa:fa-user Team Lead]
  Architect[fa:fa-user System Architect]
  Devops[fa:fa-user DevOps Engineer]
  SoftwareFactoryOrchestrationEngine[Orchestration Engine]
  SoftwareFactoryDashboard.WorkflowDesigner -. "Defines workflows" .-> SoftwareFactoryOrchestrationEngine
  SoftwareFactoryDashboard.BacklogManager -. "Schedules tasks" .-> SoftwareFactoryOrchestrationEngine
  SoftwareFactoryDashboard.MonitoringDashboard -. "Monitors agents" .-> SoftwareFactoryOrchestrationEngine
  Engineer -. "Configures and monitors AI workflows" .-> SoftwareFactoryDashboard
  TeamLead -. "Oversees autonomous development processes" .-> SoftwareFactoryDashboard
  Architect -. "Designs workflow templates and quality gates" .-> SoftwareFactoryDashboard
  Devops -. "Manages deployment configurations and monitoring" .-> SoftwareFactoryDashboard
`;case"contextIntegration":return`---
title: "Context Management Integration"
---
graph TB
  subgraph SoftwareFactoryContextManager["Context Manager"]
    SoftwareFactoryContextManager.BlueprintIntegrator[Blueprint Integrator]
    SoftwareFactoryContextManager.ContextCache[Context Cache]
    SoftwareFactoryContextManager.RequirementMapper[Requirement Mapper]
  end
  SoftwareFactoryOrchestrationEngine[Orchestration Engine]
  BlueprintSystem[Blueprint Context System]
  SoftwareFactoryContextManager -. "Retrieves business context and requirements" .-> BlueprintSystem
  SoftwareFactoryOrchestrationEngine -. "Accesses business context" .-> SoftwareFactoryContextManager
`;default:throw new Error("Unknown viewId: "+e)}}export{t as mmdSource};
