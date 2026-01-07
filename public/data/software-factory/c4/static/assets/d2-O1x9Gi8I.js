function n(e){switch(e){case"index":return`direction: down

Engineer: {
  label: "Engineer"
  shape: person
}
TeamLead: {
  label: "Team Lead"
  shape: person
}
Architect: {
  label: "System Architect"
  shape: person
}
Devops: {
  label: "DevOps Engineer"
  shape: person
}
Monitoring: {
  label: "Monitoring System"
}
SoftwareFactory: {
  label: "Software Factory Platform"

  Dashboard: {
    label: "Dashboard UI"
  }
  OrchestrationEngine: {
    label: "Orchestration Engine"
  }
  ContextManager: {
    label: "Context Manager"
  }
  DataStore: {
    label: "Data Store"
  }
  AiRuntime: {
    label: "AI Agent Runtime"
  }
}
BlueprintSystem: {
  label: "Blueprint Context System"
}
AiProvider: {
  label: "AI Provider"
}
GitRepo: {
  label: "Git Repository"
}
Cicd: {
  label: "CI/CD Pipeline"
}
TestFramework: {
  label: "Testing Framework"
}

Engineer -> SoftwareFactory.Dashboard: "Configures and monitors AI workflows"
TeamLead -> SoftwareFactory.Dashboard: "Oversees autonomous development processes"
Architect -> SoftwareFactory.Dashboard: "Designs workflow templates and quality gates"
Devops -> SoftwareFactory.Dashboard: "Manages deployment configurations and monitoring"
Monitoring -> SoftwareFactory.Dashboard: "Provides monitoring data"
SoftwareFactory.Dashboard -> SoftwareFactory.OrchestrationEngine: "Sends workflow configurations"
SoftwareFactory.OrchestrationEngine -> SoftwareFactory.AiRuntime: "Orchestrates AI agent execution"
SoftwareFactory.OrchestrationEngine -> SoftwareFactory.ContextManager: "Accesses business context"
SoftwareFactory.OrchestrationEngine -> SoftwareFactory.DataStore: "Persists configurations and artifacts"
SoftwareFactory.ContextManager -> SoftwareFactory.AiRuntime: "Provides technical specs"
SoftwareFactory.OrchestrationEngine -> Monitoring: "Sends health and performance metrics"
SoftwareFactory.AiRuntime -> AiProvider: "Executes AI-powered development tasks"
SoftwareFactory.AiRuntime -> GitRepo: "Commits generated code"
SoftwareFactory.AiRuntime -> Cicd: "Triggers automated builds"
SoftwareFactory.AiRuntime -> TestFramework: "Runs autonomous testing"
SoftwareFactory.ContextManager -> BlueprintSystem: "Retrieves business context and requirements"
`;case"containers":return`direction: down

Engineer: {
  label: "Engineer"
  shape: person
}
TeamLead: {
  label: "Team Lead"
  shape: person
}
Architect: {
  label: "System Architect"
  shape: person
}
Devops: {
  label: "DevOps Engineer"
  shape: person
}
SoftwareFactory: {
  label: "Software Factory Platform"

  Dashboard: {
    label: "Dashboard UI"
  }
  OrchestrationEngine: {
    label: "Orchestration Engine"
  }
  ContextManager: {
    label: "Context Manager"
  }
  DataStore: {
    label: "Data Store"
  }
  AiRuntime: {
    label: "AI Agent Runtime"
  }
}
Monitoring: {
  label: "Monitoring System"
}
BlueprintSystem: {
  label: "Blueprint Context System"
}
AiProvider: {
  label: "AI Provider"
}
GitRepo: {
  label: "Git Repository"
}
Cicd: {
  label: "CI/CD Pipeline"
}
TestFramework: {
  label: "Testing Framework"
}

SoftwareFactory.Dashboard -> SoftwareFactory.OrchestrationEngine: "Sends workflow configurations"
SoftwareFactory.OrchestrationEngine -> SoftwareFactory.AiRuntime: "Orchestrates AI agent execution"
SoftwareFactory.OrchestrationEngine -> SoftwareFactory.ContextManager: "Accesses business context"
SoftwareFactory.OrchestrationEngine -> SoftwareFactory.DataStore: "Persists configurations and artifacts"
SoftwareFactory.ContextManager -> SoftwareFactory.AiRuntime: "Provides technical specs"
Engineer -> SoftwareFactory.Dashboard: "Configures and monitors AI workflows"
TeamLead -> SoftwareFactory.Dashboard: "Oversees autonomous development processes"
Architect -> SoftwareFactory.Dashboard: "Designs workflow templates and quality gates"
Devops -> SoftwareFactory.Dashboard: "Manages deployment configurations and monitoring"
SoftwareFactory.AiRuntime -> AiProvider: "Executes AI-powered development tasks"
SoftwareFactory.AiRuntime -> GitRepo: "Commits generated code"
SoftwareFactory.AiRuntime -> Cicd: "Triggers automated builds"
SoftwareFactory.AiRuntime -> TestFramework: "Runs autonomous testing"
SoftwareFactory.OrchestrationEngine -> Monitoring: "Sends health and performance metrics"
Monitoring -> SoftwareFactory.Dashboard: "Provides monitoring data"
SoftwareFactory.ContextManager -> BlueprintSystem: "Retrieves business context and requirements"
`;case"orchestrationComponents":return`direction: down

SoftwareFactoryDashboard: {
  label: "Dashboard UI"
}
SoftwareFactoryOrchestrationEngine: {
  label: "Orchestration Engine"

  WorkflowOrchestrator: {
    label: "Workflow Orchestrator"
  }
  AgentCoordinator: {
    label: "Agent Coordinator"
  }
  QualityGate: {
    label: "Quality Gate"
  }
  DeploymentManager: {
    label: "Deployment Manager"
  }
}
SoftwareFactoryContextManager: {
  label: "Context Manager"
}
SoftwareFactoryAiRuntime: {
  label: "AI Agent Runtime"
}

SoftwareFactoryDashboard -> SoftwareFactoryOrchestrationEngine.WorkflowOrchestrator: "[...]"
SoftwareFactoryDashboard -> SoftwareFactoryOrchestrationEngine.AgentCoordinator: "Monitors agents"
SoftwareFactoryOrchestrationEngine.WorkflowOrchestrator -> SoftwareFactoryAiRuntime: "Initiates development"
SoftwareFactoryOrchestrationEngine.QualityGate -> SoftwareFactoryAiRuntime: "Triggers review"
SoftwareFactoryOrchestrationEngine.DeploymentManager -> SoftwareFactoryAiRuntime: "Manages deployment"
SoftwareFactoryContextManager -> SoftwareFactoryAiRuntime: "Provides technical specs"
SoftwareFactoryOrchestrationEngine -> SoftwareFactoryContextManager: "Accesses business context"
`;case"aiAgents":return`direction: down

SoftwareFactoryAiRuntime: {
  label: "AI Agent Runtime"

  TestGenerator: {
    label: "Test Generator Agent"
  }
  CodeGenerator: {
    label: "Code Generator Agent"
  }
  ReviewerAgent: {
    label: "Code Review Agent"
  }
  DeploymentAgent: {
    label: "Deployment Agent"
  }
}
SoftwareFactoryOrchestrationEngine: {
  label: "Orchestration Engine"
}
AiProvider: {
  label: "AI Provider"
}
GitRepo: {
  label: "Git Repository"
}
Cicd: {
  label: "CI/CD Pipeline"
}
TestFramework: {
  label: "Testing Framework"
}

SoftwareFactoryOrchestrationEngine -> SoftwareFactoryAiRuntime.CodeGenerator: "Initiates development"
SoftwareFactoryOrchestrationEngine -> SoftwareFactoryAiRuntime.ReviewerAgent: "Triggers review"
SoftwareFactoryOrchestrationEngine -> SoftwareFactoryAiRuntime.DeploymentAgent: "Manages deployment"
SoftwareFactoryAiRuntime -> AiProvider: "Executes AI-powered development tasks"
SoftwareFactoryAiRuntime -> GitRepo: "Commits generated code"
SoftwareFactoryAiRuntime -> Cicd: "Triggers automated builds"
SoftwareFactoryAiRuntime -> TestFramework: "Runs autonomous testing"
`;case"dashboardComponents":return`direction: down

SoftwareFactoryDashboard: {
  label: "Dashboard UI"

  BlueprintViewer: {
    label: "Blueprint Viewer"
  }
  WorkflowDesigner: {
    label: "Workflow Designer"
  }
  BacklogManager: {
    label: "Backlog Manager"
  }
  MonitoringDashboard: {
    label: "Monitoring Dashboard"
  }
}
Engineer: {
  label: "Engineer"
  shape: person
}
TeamLead: {
  label: "Team Lead"
  shape: person
}
Architect: {
  label: "System Architect"
  shape: person
}
Devops: {
  label: "DevOps Engineer"
  shape: person
}
SoftwareFactoryOrchestrationEngine: {
  label: "Orchestration Engine"
}

SoftwareFactoryDashboard.WorkflowDesigner -> SoftwareFactoryOrchestrationEngine: "Defines workflows"
SoftwareFactoryDashboard.BacklogManager -> SoftwareFactoryOrchestrationEngine: "Schedules tasks"
SoftwareFactoryDashboard.MonitoringDashboard -> SoftwareFactoryOrchestrationEngine: "Monitors agents"
Engineer -> SoftwareFactoryDashboard: "Configures and monitors AI workflows"
TeamLead -> SoftwareFactoryDashboard: "Oversees autonomous development processes"
Architect -> SoftwareFactoryDashboard: "Designs workflow templates and quality gates"
Devops -> SoftwareFactoryDashboard: "Manages deployment configurations and monitoring"
`;case"contextIntegration":return`direction: down

SoftwareFactoryContextManager: {
  label: "Context Manager"

  BlueprintIntegrator: {
    label: "Blueprint Integrator"
  }
  ContextCache: {
    label: "Context Cache"
  }
  RequirementMapper: {
    label: "Requirement Mapper"
  }
}
SoftwareFactoryOrchestrationEngine: {
  label: "Orchestration Engine"
}
BlueprintSystem: {
  label: "Blueprint Context System"
}

SoftwareFactoryContextManager -> BlueprintSystem: "Retrieves business context and requirements"
SoftwareFactoryOrchestrationEngine -> SoftwareFactoryContextManager: "Accesses business context"
`;default:throw new Error("Unknown viewId: "+e)}}export{n as d2Source};
