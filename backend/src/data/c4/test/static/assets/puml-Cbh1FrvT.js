function o(n){switch(n){case"index":return`@startuml
title "Software Factory - System Context"
top to bottom direction

hide stereotype
skinparam ranksep 60
skinparam nodesep 30
skinparam {
  arrowFontSize 10
  defaultTextAlignment center
  wrapWidth 200
  maxMessageSize 100
  shadowing false
}

skinparam person<<Engineer>>{
  BackgroundColor #A35829
  FontColor #FFE0C2
  BorderColor #7E451D
}
skinparam person<<TeamLead>>{
  BackgroundColor #A35829
  FontColor #FFE0C2
  BorderColor #7E451D
}
skinparam person<<Architect>>{
  BackgroundColor #A35829
  FontColor #FFE0C2
  BorderColor #7E451D
}
skinparam person<<Devops>>{
  BackgroundColor #A35829
  FontColor #FFE0C2
  BorderColor #7E451D
}
skinparam rectangle<<Monitoring>>{
  BackgroundColor #737373
  FontColor #fafafa
  BorderColor #525252
}
skinparam rectangle<<SoftwareFactoryDashboard>>{
  BackgroundColor #428a4f
  FontColor #f8fafc
  BorderColor #2d5d39
}
skinparam rectangle<<SoftwareFactoryOrchestrationEngine>>{
  BackgroundColor #428a4f
  FontColor #f8fafc
  BorderColor #2d5d39
}
skinparam rectangle<<SoftwareFactoryContextManager>>{
  BackgroundColor #428a4f
  FontColor #f8fafc
  BorderColor #2d5d39
}
skinparam rectangle<<SoftwareFactoryDataStore>>{
  BackgroundColor #428a4f
  FontColor #f8fafc
  BorderColor #2d5d39
}
skinparam rectangle<<SoftwareFactoryAiRuntime>>{
  BackgroundColor #428a4f
  FontColor #f8fafc
  BorderColor #2d5d39
}
skinparam rectangle<<BlueprintSystem>>{
  BackgroundColor #737373
  FontColor #fafafa
  BorderColor #525252
}
skinparam rectangle<<AiProvider>>{
  BackgroundColor #737373
  FontColor #fafafa
  BorderColor #525252
}
skinparam rectangle<<GitRepo>>{
  BackgroundColor #737373
  FontColor #fafafa
  BorderColor #525252
}
skinparam rectangle<<Cicd>>{
  BackgroundColor #737373
  FontColor #fafafa
  BorderColor #525252
}
skinparam rectangle<<TestFramework>>{
  BackgroundColor #737373
  FontColor #fafafa
  BorderColor #525252
}
person "==Engineer\\n\\nSoftware engineer overseeing autonomous SDLC workflows" <<Engineer>> as Engineer
person "==Team Lead\\n\\nEngineering manager configuring and monitoring AI workflows" <<TeamLead>> as TeamLead
person "==System Architect\\n\\nTechnical architect designing autonomous development processes" <<Architect>> as Architect
person "==DevOps Engineer\\n\\nInfrastructure and deployment specialist" <<Devops>> as Devops
rectangle "==Monitoring System\\n\\nApplication performance monitoring and alerting" <<Monitoring>> as Monitoring
rectangle "Software Factory Platform" <<SoftwareFactory>> as SoftwareFactory {
  skinparam RectangleBorderColor<<SoftwareFactory>> #3b82f6
  skinparam RectangleFontColor<<SoftwareFactory>> #3b82f6
  skinparam RectangleBorderStyle<<SoftwareFactory>> dashed

  rectangle "==Dashboard UI\\n\\nReact-based web interface for workflow configuration, monitoring, and oversight" <<SoftwareFactoryDashboard>> as SoftwareFactoryDashboard
  rectangle "==Orchestration Engine\\n\\nBackend service coordinating AI agents through SDLC phases" <<SoftwareFactoryOrchestrationEngine>> as SoftwareFactoryOrchestrationEngine
  rectangle "==Context Manager\\n\\nIntegration layer with Blueprint system for business context" <<SoftwareFactoryContextManager>> as SoftwareFactoryContextManager
  rectangle "==Data Store\\n\\nPersistent storage for workflows, configurations, and artifacts" <<SoftwareFactoryDataStore>> as SoftwareFactoryDataStore
  rectangle "==AI Agent Runtime\\n\\nExecution environment for AI development agents" <<SoftwareFactoryAiRuntime>> as SoftwareFactoryAiRuntime
}
rectangle "==Blueprint Context System\\n\\nStructured business context and requirements management" <<BlueprintSystem>> as BlueprintSystem
rectangle "==AI Provider\\n\\nClaude Code, OpenAI GPT, or other AI coding assistants" <<AiProvider>> as AiProvider
rectangle "==Git Repository\\n\\nVersion control for generated code and configurations" <<GitRepo>> as GitRepo
rectangle "==CI/CD Pipeline\\n\\nContinuous integration and deployment systems" <<Cicd>> as Cicd
rectangle "==Testing Framework\\n\\nTestZeus or other autonomous testing platforms" <<TestFramework>> as TestFramework

Engineer .[#8D8D8D,thickness=2].> SoftwareFactoryDashboard : "<color:#8D8D8D>Configures and monitors AI workflows<color:#8D8D8D>"
TeamLead .[#8D8D8D,thickness=2].> SoftwareFactoryDashboard : "<color:#8D8D8D>Oversees autonomous development processes<color:#8D8D8D>"
Architect .[#8D8D8D,thickness=2].> SoftwareFactoryDashboard : "<color:#8D8D8D>Designs workflow templates and quality gates<color:#8D8D8D>"
Devops .[#8D8D8D,thickness=2].> SoftwareFactoryDashboard : "<color:#8D8D8D>Manages deployment configurations and monitoring<color:#8D8D8D>"
Monitoring .[#8D8D8D,thickness=2].> SoftwareFactoryDashboard : "<color:#8D8D8D>Provides monitoring data<color:#8D8D8D>"
SoftwareFactoryDashboard .[#8D8D8D,thickness=2].> SoftwareFactoryOrchestrationEngine : "<color:#8D8D8D>Sends workflow configurations<color:#8D8D8D>"
SoftwareFactoryOrchestrationEngine .[#8D8D8D,thickness=2].> SoftwareFactoryAiRuntime : "<color:#8D8D8D>Orchestrates AI agent execution<color:#8D8D8D>"
SoftwareFactoryOrchestrationEngine .[#8D8D8D,thickness=2].> SoftwareFactoryContextManager : "<color:#8D8D8D>Accesses business context<color:#8D8D8D>"
SoftwareFactoryOrchestrationEngine .[#8D8D8D,thickness=2].> SoftwareFactoryDataStore : "<color:#8D8D8D>Persists configurations and artifacts<color:#8D8D8D>"
SoftwareFactoryContextManager .[#8D8D8D,thickness=2].> SoftwareFactoryAiRuntime : "<color:#8D8D8D>Provides technical specs<color:#8D8D8D>"
SoftwareFactoryOrchestrationEngine .[#8D8D8D,thickness=2].> Monitoring : "<color:#8D8D8D>Sends health and performance metrics<color:#8D8D8D>"
SoftwareFactoryAiRuntime .[#8D8D8D,thickness=2].> AiProvider : "<color:#8D8D8D>Executes AI-powered development tasks<color:#8D8D8D>"
SoftwareFactoryAiRuntime .[#8D8D8D,thickness=2].> GitRepo : "<color:#8D8D8D>Commits generated code<color:#8D8D8D>"
SoftwareFactoryAiRuntime .[#8D8D8D,thickness=2].> Cicd : "<color:#8D8D8D>Triggers automated builds<color:#8D8D8D>"
SoftwareFactoryAiRuntime .[#8D8D8D,thickness=2].> TestFramework : "<color:#8D8D8D>Runs autonomous testing<color:#8D8D8D>"
SoftwareFactoryContextManager .[#8D8D8D,thickness=2].> BlueprintSystem : "<color:#8D8D8D>Retrieves business context and requirements<color:#8D8D8D>"
@enduml
`;case"containers":return`@startuml
title "Software Factory - Containers"
top to bottom direction

hide stereotype
skinparam ranksep 60
skinparam nodesep 30
skinparam {
  arrowFontSize 10
  defaultTextAlignment center
  wrapWidth 200
  maxMessageSize 100
  shadowing false
}

skinparam person<<Engineer>>{
  BackgroundColor #A35829
  FontColor #FFE0C2
  BorderColor #7E451D
}
skinparam person<<TeamLead>>{
  BackgroundColor #A35829
  FontColor #FFE0C2
  BorderColor #7E451D
}
skinparam person<<Architect>>{
  BackgroundColor #A35829
  FontColor #FFE0C2
  BorderColor #7E451D
}
skinparam person<<Devops>>{
  BackgroundColor #A35829
  FontColor #FFE0C2
  BorderColor #7E451D
}
skinparam rectangle<<SoftwareFactoryDashboard>>{
  BackgroundColor #428a4f
  FontColor #f8fafc
  BorderColor #2d5d39
}
skinparam rectangle<<SoftwareFactoryOrchestrationEngine>>{
  BackgroundColor #428a4f
  FontColor #f8fafc
  BorderColor #2d5d39
}
skinparam rectangle<<SoftwareFactoryContextManager>>{
  BackgroundColor #428a4f
  FontColor #f8fafc
  BorderColor #2d5d39
}
skinparam rectangle<<SoftwareFactoryDataStore>>{
  BackgroundColor #428a4f
  FontColor #f8fafc
  BorderColor #2d5d39
}
skinparam rectangle<<Monitoring>>{
  BackgroundColor #737373
  FontColor #fafafa
  BorderColor #525252
}
skinparam rectangle<<SoftwareFactoryAiRuntime>>{
  BackgroundColor #428a4f
  FontColor #f8fafc
  BorderColor #2d5d39
}
skinparam rectangle<<BlueprintSystem>>{
  BackgroundColor #737373
  FontColor #fafafa
  BorderColor #525252
}
skinparam rectangle<<AiProvider>>{
  BackgroundColor #737373
  FontColor #fafafa
  BorderColor #525252
}
skinparam rectangle<<GitRepo>>{
  BackgroundColor #737373
  FontColor #fafafa
  BorderColor #525252
}
skinparam rectangle<<Cicd>>{
  BackgroundColor #737373
  FontColor #fafafa
  BorderColor #525252
}
skinparam rectangle<<TestFramework>>{
  BackgroundColor #737373
  FontColor #fafafa
  BorderColor #525252
}
person "==Engineer\\n\\nSoftware engineer overseeing autonomous SDLC workflows" <<Engineer>> as Engineer
person "==Team Lead\\n\\nEngineering manager configuring and monitoring AI workflows" <<TeamLead>> as TeamLead
person "==System Architect\\n\\nTechnical architect designing autonomous development processes" <<Architect>> as Architect
person "==DevOps Engineer\\n\\nInfrastructure and deployment specialist" <<Devops>> as Devops
rectangle "Software Factory Platform" <<SoftwareFactory>> as SoftwareFactory {
  skinparam RectangleBorderColor<<SoftwareFactory>> #3b82f6
  skinparam RectangleFontColor<<SoftwareFactory>> #3b82f6
  skinparam RectangleBorderStyle<<SoftwareFactory>> dashed

  rectangle "==Dashboard UI\\n\\nReact-based web interface for workflow configuration, monitoring, and oversight" <<SoftwareFactoryDashboard>> as SoftwareFactoryDashboard
  rectangle "==Orchestration Engine\\n\\nBackend service coordinating AI agents through SDLC phases" <<SoftwareFactoryOrchestrationEngine>> as SoftwareFactoryOrchestrationEngine
  rectangle "==Context Manager\\n\\nIntegration layer with Blueprint system for business context" <<SoftwareFactoryContextManager>> as SoftwareFactoryContextManager
  rectangle "==Data Store\\n\\nPersistent storage for workflows, configurations, and artifacts" <<SoftwareFactoryDataStore>> as SoftwareFactoryDataStore
  rectangle "==AI Agent Runtime\\n\\nExecution environment for AI development agents" <<SoftwareFactoryAiRuntime>> as SoftwareFactoryAiRuntime
}
rectangle "==Monitoring System\\n\\nApplication performance monitoring and alerting" <<Monitoring>> as Monitoring
rectangle "==Blueprint Context System\\n\\nStructured business context and requirements management" <<BlueprintSystem>> as BlueprintSystem
rectangle "==AI Provider\\n\\nClaude Code, OpenAI GPT, or other AI coding assistants" <<AiProvider>> as AiProvider
rectangle "==Git Repository\\n\\nVersion control for generated code and configurations" <<GitRepo>> as GitRepo
rectangle "==CI/CD Pipeline\\n\\nContinuous integration and deployment systems" <<Cicd>> as Cicd
rectangle "==Testing Framework\\n\\nTestZeus or other autonomous testing platforms" <<TestFramework>> as TestFramework

SoftwareFactoryDashboard .[#8D8D8D,thickness=2].> SoftwareFactoryOrchestrationEngine : "<color:#8D8D8D>Sends workflow configurations<color:#8D8D8D>"
SoftwareFactoryOrchestrationEngine .[#8D8D8D,thickness=2].> SoftwareFactoryAiRuntime : "<color:#8D8D8D>Orchestrates AI agent execution<color:#8D8D8D>"
SoftwareFactoryOrchestrationEngine .[#8D8D8D,thickness=2].> SoftwareFactoryContextManager : "<color:#8D8D8D>Accesses business context<color:#8D8D8D>"
SoftwareFactoryOrchestrationEngine .[#8D8D8D,thickness=2].> SoftwareFactoryDataStore : "<color:#8D8D8D>Persists configurations and artifacts<color:#8D8D8D>"
SoftwareFactoryContextManager .[#8D8D8D,thickness=2].> SoftwareFactoryAiRuntime : "<color:#8D8D8D>Provides technical specs<color:#8D8D8D>"
Engineer .[#8D8D8D,thickness=2].> SoftwareFactoryDashboard : "<color:#8D8D8D>Configures and monitors AI workflows<color:#8D8D8D>"
TeamLead .[#8D8D8D,thickness=2].> SoftwareFactoryDashboard : "<color:#8D8D8D>Oversees autonomous development processes<color:#8D8D8D>"
Architect .[#8D8D8D,thickness=2].> SoftwareFactoryDashboard : "<color:#8D8D8D>Designs workflow templates and quality gates<color:#8D8D8D>"
Devops .[#8D8D8D,thickness=2].> SoftwareFactoryDashboard : "<color:#8D8D8D>Manages deployment configurations and monitoring<color:#8D8D8D>"
SoftwareFactoryAiRuntime .[#8D8D8D,thickness=2].> AiProvider : "<color:#8D8D8D>Executes AI-powered development tasks<color:#8D8D8D>"
SoftwareFactoryAiRuntime .[#8D8D8D,thickness=2].> GitRepo : "<color:#8D8D8D>Commits generated code<color:#8D8D8D>"
SoftwareFactoryAiRuntime .[#8D8D8D,thickness=2].> Cicd : "<color:#8D8D8D>Triggers automated builds<color:#8D8D8D>"
SoftwareFactoryAiRuntime .[#8D8D8D,thickness=2].> TestFramework : "<color:#8D8D8D>Runs autonomous testing<color:#8D8D8D>"
SoftwareFactoryOrchestrationEngine .[#8D8D8D,thickness=2].> Monitoring : "<color:#8D8D8D>Sends health and performance metrics<color:#8D8D8D>"
Monitoring .[#8D8D8D,thickness=2].> SoftwareFactoryDashboard : "<color:#8D8D8D>Provides monitoring data<color:#8D8D8D>"
SoftwareFactoryContextManager .[#8D8D8D,thickness=2].> BlueprintSystem : "<color:#8D8D8D>Retrieves business context and requirements<color:#8D8D8D>"
@enduml
`;case"orchestrationComponents":return`@startuml
title "Orchestration Engine Components"
top to bottom direction

hide stereotype
skinparam ranksep 60
skinparam nodesep 30
skinparam {
  arrowFontSize 10
  defaultTextAlignment center
  wrapWidth 200
  maxMessageSize 100
  shadowing false
}

skinparam rectangle<<SoftwareFactoryDashboard>>{
  BackgroundColor #428a4f
  FontColor #f8fafc
  BorderColor #2d5d39
}
skinparam rectangle<<SoftwareFactoryOrchestrationEngineWorkflowOrchestrator>>{
  BackgroundColor #64748b
  FontColor #f8fafc
  BorderColor #475569
}
skinparam rectangle<<SoftwareFactoryOrchestrationEngineAgentCoordinator>>{
  BackgroundColor #64748b
  FontColor #f8fafc
  BorderColor #475569
}
skinparam rectangle<<SoftwareFactoryOrchestrationEngineQualityGate>>{
  BackgroundColor #64748b
  FontColor #f8fafc
  BorderColor #475569
}
skinparam rectangle<<SoftwareFactoryOrchestrationEngineDeploymentManager>>{
  BackgroundColor #64748b
  FontColor #f8fafc
  BorderColor #475569
}
skinparam rectangle<<SoftwareFactoryContextManager>>{
  BackgroundColor #428a4f
  FontColor #f8fafc
  BorderColor #2d5d39
}
skinparam rectangle<<SoftwareFactoryAiRuntime>>{
  BackgroundColor #428a4f
  FontColor #f8fafc
  BorderColor #2d5d39
}
rectangle "==Dashboard UI\\n\\nReact-based web interface for workflow configuration, monitoring, and oversight" <<SoftwareFactoryDashboard>> as SoftwareFactoryDashboard
rectangle "Orchestration Engine" <<SoftwareFactoryOrchestrationEngine>> as SoftwareFactoryOrchestrationEngine {
  skinparam RectangleBorderColor<<SoftwareFactoryOrchestrationEngine>> #428a4f
  skinparam RectangleFontColor<<SoftwareFactoryOrchestrationEngine>> #428a4f
  skinparam RectangleBorderStyle<<SoftwareFactoryOrchestrationEngine>> dashed

  rectangle "==Workflow Orchestrator\\n\\nManages execution flow through planning, development, testing, deployment phases" <<SoftwareFactoryOrchestrationEngineWorkflowOrchestrator>> as SoftwareFactoryOrchestrationEngineWorkflowOrchestrator
  rectangle "==Agent Coordinator\\n\\nManages multiple AI agents and their interactions" <<SoftwareFactoryOrchestrationEngineAgentCoordinator>> as SoftwareFactoryOrchestrationEngineAgentCoordinator
  rectangle "==Quality Gate\\n\\nAutomated code review and validation checkpoints" <<SoftwareFactoryOrchestrationEngineQualityGate>> as SoftwareFactoryOrchestrationEngineQualityGate
  rectangle "==Deployment Manager\\n\\nHandles automated deployment with feature flags" <<SoftwareFactoryOrchestrationEngineDeploymentManager>> as SoftwareFactoryOrchestrationEngineDeploymentManager
}
rectangle "==Context Manager\\n\\nIntegration layer with Blueprint system for business context" <<SoftwareFactoryContextManager>> as SoftwareFactoryContextManager
rectangle "==AI Agent Runtime\\n\\nExecution environment for AI development agents" <<SoftwareFactoryAiRuntime>> as SoftwareFactoryAiRuntime

SoftwareFactoryDashboard .[#8D8D8D,thickness=2].> SoftwareFactoryOrchestrationEngineWorkflowOrchestrator : "<color:#8D8D8D>[...]<color:#8D8D8D>"
SoftwareFactoryDashboard .[#8D8D8D,thickness=2].> SoftwareFactoryOrchestrationEngineAgentCoordinator : "<color:#8D8D8D>Monitors agents<color:#8D8D8D>"
SoftwareFactoryOrchestrationEngineWorkflowOrchestrator .[#8D8D8D,thickness=2].> SoftwareFactoryAiRuntime : "<color:#8D8D8D>Initiates development<color:#8D8D8D>"
SoftwareFactoryOrchestrationEngineQualityGate .[#8D8D8D,thickness=2].> SoftwareFactoryAiRuntime : "<color:#8D8D8D>Triggers review<color:#8D8D8D>"
SoftwareFactoryOrchestrationEngineDeploymentManager .[#8D8D8D,thickness=2].> SoftwareFactoryAiRuntime : "<color:#8D8D8D>Manages deployment<color:#8D8D8D>"
SoftwareFactoryContextManager .[#8D8D8D,thickness=2].> SoftwareFactoryAiRuntime : "<color:#8D8D8D>Provides technical specs<color:#8D8D8D>"
SoftwareFactoryOrchestrationEngine .[#8D8D8D,thickness=2].> SoftwareFactoryContextManager : "<color:#8D8D8D>Accesses business context<color:#8D8D8D>"
@enduml
`;case"aiAgents":return`@startuml
title "AI Agent Runtime Components"
top to bottom direction

hide stereotype
skinparam ranksep 60
skinparam nodesep 30
skinparam {
  arrowFontSize 10
  defaultTextAlignment center
  wrapWidth 200
  maxMessageSize 100
  shadowing false
}

skinparam rectangle<<SoftwareFactoryAiRuntimeTestGenerator>>{
  BackgroundColor #64748b
  FontColor #f8fafc
  BorderColor #475569
}
skinparam rectangle<<SoftwareFactoryOrchestrationEngine>>{
  BackgroundColor #428a4f
  FontColor #f8fafc
  BorderColor #2d5d39
}
skinparam rectangle<<SoftwareFactoryAiRuntimeCodeGenerator>>{
  BackgroundColor #64748b
  FontColor #f8fafc
  BorderColor #475569
}
skinparam rectangle<<SoftwareFactoryAiRuntimeReviewerAgent>>{
  BackgroundColor #64748b
  FontColor #f8fafc
  BorderColor #475569
}
skinparam rectangle<<SoftwareFactoryAiRuntimeDeploymentAgent>>{
  BackgroundColor #64748b
  FontColor #f8fafc
  BorderColor #475569
}
skinparam rectangle<<AiProvider>>{
  BackgroundColor #737373
  FontColor #fafafa
  BorderColor #525252
}
skinparam rectangle<<GitRepo>>{
  BackgroundColor #737373
  FontColor #fafafa
  BorderColor #525252
}
skinparam rectangle<<Cicd>>{
  BackgroundColor #737373
  FontColor #fafafa
  BorderColor #525252
}
skinparam rectangle<<TestFramework>>{
  BackgroundColor #737373
  FontColor #fafafa
  BorderColor #525252
}
rectangle "AI Agent Runtime" <<SoftwareFactoryAiRuntime>> as SoftwareFactoryAiRuntime {
  skinparam RectangleBorderColor<<SoftwareFactoryAiRuntime>> #428a4f
  skinparam RectangleFontColor<<SoftwareFactoryAiRuntime>> #428a4f
  skinparam RectangleBorderStyle<<SoftwareFactoryAiRuntime>> dashed

  rectangle "==Test Generator Agent\\n\\nAI agent that creates comprehensive test suites" <<SoftwareFactoryAiRuntimeTestGenerator>> as SoftwareFactoryAiRuntimeTestGenerator
  rectangle "==Code Generator Agent\\n\\nAI agent responsible for autonomous code generation and refactoring" <<SoftwareFactoryAiRuntimeCodeGenerator>> as SoftwareFactoryAiRuntimeCodeGenerator
  rectangle "==Code Review Agent\\n\\nAI agent performing automated code quality assessment" <<SoftwareFactoryAiRuntimeReviewerAgent>> as SoftwareFactoryAiRuntimeReviewerAgent
  rectangle "==Deployment Agent\\n\\nAI agent managing deployment automation and rollback" <<SoftwareFactoryAiRuntimeDeploymentAgent>> as SoftwareFactoryAiRuntimeDeploymentAgent
}
rectangle "==Orchestration Engine\\n\\nBackend service coordinating AI agents through SDLC phases" <<SoftwareFactoryOrchestrationEngine>> as SoftwareFactoryOrchestrationEngine
rectangle "==AI Provider\\n\\nClaude Code, OpenAI GPT, or other AI coding assistants" <<AiProvider>> as AiProvider
rectangle "==Git Repository\\n\\nVersion control for generated code and configurations" <<GitRepo>> as GitRepo
rectangle "==CI/CD Pipeline\\n\\nContinuous integration and deployment systems" <<Cicd>> as Cicd
rectangle "==Testing Framework\\n\\nTestZeus or other autonomous testing platforms" <<TestFramework>> as TestFramework

SoftwareFactoryOrchestrationEngine .[#8D8D8D,thickness=2].> SoftwareFactoryAiRuntimeCodeGenerator : "<color:#8D8D8D>Initiates development<color:#8D8D8D>"
SoftwareFactoryOrchestrationEngine .[#8D8D8D,thickness=2].> SoftwareFactoryAiRuntimeReviewerAgent : "<color:#8D8D8D>Triggers review<color:#8D8D8D>"
SoftwareFactoryOrchestrationEngine .[#8D8D8D,thickness=2].> SoftwareFactoryAiRuntimeDeploymentAgent : "<color:#8D8D8D>Manages deployment<color:#8D8D8D>"
SoftwareFactoryAiRuntime .[#8D8D8D,thickness=2].> AiProvider : "<color:#8D8D8D>Executes AI-powered development tasks<color:#8D8D8D>"
SoftwareFactoryAiRuntime .[#8D8D8D,thickness=2].> GitRepo : "<color:#8D8D8D>Commits generated code<color:#8D8D8D>"
SoftwareFactoryAiRuntime .[#8D8D8D,thickness=2].> Cicd : "<color:#8D8D8D>Triggers automated builds<color:#8D8D8D>"
SoftwareFactoryAiRuntime .[#8D8D8D,thickness=2].> TestFramework : "<color:#8D8D8D>Runs autonomous testing<color:#8D8D8D>"
@enduml
`;case"dashboardComponents":return`@startuml
title "Dashboard UI Components"
top to bottom direction

hide stereotype
skinparam ranksep 60
skinparam nodesep 30
skinparam {
  arrowFontSize 10
  defaultTextAlignment center
  wrapWidth 200
  maxMessageSize 100
  shadowing false
}

skinparam rectangle<<SoftwareFactoryDashboardBlueprintViewer>>{
  BackgroundColor #64748b
  FontColor #f8fafc
  BorderColor #475569
}
skinparam person<<Engineer>>{
  BackgroundColor #A35829
  FontColor #FFE0C2
  BorderColor #7E451D
}
skinparam person<<TeamLead>>{
  BackgroundColor #A35829
  FontColor #FFE0C2
  BorderColor #7E451D
}
skinparam person<<Architect>>{
  BackgroundColor #A35829
  FontColor #FFE0C2
  BorderColor #7E451D
}
skinparam person<<Devops>>{
  BackgroundColor #A35829
  FontColor #FFE0C2
  BorderColor #7E451D
}
skinparam rectangle<<SoftwareFactoryDashboardWorkflowDesigner>>{
  BackgroundColor #64748b
  FontColor #f8fafc
  BorderColor #475569
}
skinparam rectangle<<SoftwareFactoryDashboardBacklogManager>>{
  BackgroundColor #64748b
  FontColor #f8fafc
  BorderColor #475569
}
skinparam rectangle<<SoftwareFactoryDashboardMonitoringDashboard>>{
  BackgroundColor #64748b
  FontColor #f8fafc
  BorderColor #475569
}
skinparam rectangle<<SoftwareFactoryOrchestrationEngine>>{
  BackgroundColor #428a4f
  FontColor #f8fafc
  BorderColor #2d5d39
}
rectangle "Dashboard UI" <<SoftwareFactoryDashboard>> as SoftwareFactoryDashboard {
  skinparam RectangleBorderColor<<SoftwareFactoryDashboard>> #428a4f
  skinparam RectangleFontColor<<SoftwareFactoryDashboard>> #428a4f
  skinparam RectangleBorderStyle<<SoftwareFactoryDashboard>> dashed

  rectangle "==Blueprint Viewer\\n\\nIntegration with Blueprint system for context visualization" <<SoftwareFactoryDashboardBlueprintViewer>> as SoftwareFactoryDashboardBlueprintViewer
  rectangle "==Workflow Designer\\n\\nNo-code visual designer for configuring AI agent workflows" <<SoftwareFactoryDashboardWorkflowDesigner>> as SoftwareFactoryDashboardWorkflowDesigner
  rectangle "==Backlog Manager\\n\\nTask scheduling and prioritization interface for AI agents" <<SoftwareFactoryDashboardBacklogManager>> as SoftwareFactoryDashboardBacklogManager
  rectangle "==Monitoring Dashboard\\n\\nReal-time monitoring of AI agent activities and system health" <<SoftwareFactoryDashboardMonitoringDashboard>> as SoftwareFactoryDashboardMonitoringDashboard
}
person "==Engineer\\n\\nSoftware engineer overseeing autonomous SDLC workflows" <<Engineer>> as Engineer
person "==Team Lead\\n\\nEngineering manager configuring and monitoring AI workflows" <<TeamLead>> as TeamLead
person "==System Architect\\n\\nTechnical architect designing autonomous development processes" <<Architect>> as Architect
person "==DevOps Engineer\\n\\nInfrastructure and deployment specialist" <<Devops>> as Devops
rectangle "==Orchestration Engine\\n\\nBackend service coordinating AI agents through SDLC phases" <<SoftwareFactoryOrchestrationEngine>> as SoftwareFactoryOrchestrationEngine

SoftwareFactoryDashboardWorkflowDesigner .[#8D8D8D,thickness=2].> SoftwareFactoryOrchestrationEngine : "<color:#8D8D8D>Defines workflows<color:#8D8D8D>"
SoftwareFactoryDashboardBacklogManager .[#8D8D8D,thickness=2].> SoftwareFactoryOrchestrationEngine : "<color:#8D8D8D>Schedules tasks<color:#8D8D8D>"
SoftwareFactoryDashboardMonitoringDashboard .[#8D8D8D,thickness=2].> SoftwareFactoryOrchestrationEngine : "<color:#8D8D8D>Monitors agents<color:#8D8D8D>"
Engineer .[#8D8D8D,thickness=2].> SoftwareFactoryDashboard : "<color:#8D8D8D>Configures and monitors AI workflows<color:#8D8D8D>"
TeamLead .[#8D8D8D,thickness=2].> SoftwareFactoryDashboard : "<color:#8D8D8D>Oversees autonomous development processes<color:#8D8D8D>"
Architect .[#8D8D8D,thickness=2].> SoftwareFactoryDashboard : "<color:#8D8D8D>Designs workflow templates and quality gates<color:#8D8D8D>"
Devops .[#8D8D8D,thickness=2].> SoftwareFactoryDashboard : "<color:#8D8D8D>Manages deployment configurations and monitoring<color:#8D8D8D>"
@enduml
`;case"contextIntegration":return`@startuml
title "Context Management Integration"
top to bottom direction

hide stereotype
skinparam ranksep 60
skinparam nodesep 30
skinparam {
  arrowFontSize 10
  defaultTextAlignment center
  wrapWidth 200
  maxMessageSize 100
  shadowing false
}

skinparam rectangle<<SoftwareFactoryContextManagerBlueprintIntegrator>>{
  BackgroundColor #64748b
  FontColor #f8fafc
  BorderColor #475569
}
skinparam rectangle<<SoftwareFactoryContextManagerContextCache>>{
  BackgroundColor #64748b
  FontColor #f8fafc
  BorderColor #475569
}
skinparam rectangle<<SoftwareFactoryContextManagerRequirementMapper>>{
  BackgroundColor #64748b
  FontColor #f8fafc
  BorderColor #475569
}
skinparam rectangle<<SoftwareFactoryOrchestrationEngine>>{
  BackgroundColor #428a4f
  FontColor #f8fafc
  BorderColor #2d5d39
}
skinparam rectangle<<BlueprintSystem>>{
  BackgroundColor #737373
  FontColor #fafafa
  BorderColor #525252
}
rectangle "Context Manager" <<SoftwareFactoryContextManager>> as SoftwareFactoryContextManager {
  skinparam RectangleBorderColor<<SoftwareFactoryContextManager>> #428a4f
  skinparam RectangleFontColor<<SoftwareFactoryContextManager>> #428a4f
  skinparam RectangleBorderStyle<<SoftwareFactoryContextManager>> dashed

  rectangle "==Blueprint Integrator\\n\\nAPI client for accessing structured business requirements and context" <<SoftwareFactoryContextManagerBlueprintIntegrator>> as SoftwareFactoryContextManagerBlueprintIntegrator
  rectangle "==Context Cache\\n\\nLocal caching of blueprint data for AI agent access" <<SoftwareFactoryContextManagerContextCache>> as SoftwareFactoryContextManagerContextCache
  rectangle "==Requirement Mapper\\n\\nTranslates business requirements into technical specifications" <<SoftwareFactoryContextManagerRequirementMapper>> as SoftwareFactoryContextManagerRequirementMapper
}
rectangle "==Orchestration Engine\\n\\nBackend service coordinating AI agents through SDLC phases" <<SoftwareFactoryOrchestrationEngine>> as SoftwareFactoryOrchestrationEngine
rectangle "==Blueprint Context System\\n\\nStructured business context and requirements management" <<BlueprintSystem>> as BlueprintSystem

SoftwareFactoryContextManager .[#8D8D8D,thickness=2].> BlueprintSystem : "<color:#8D8D8D>Retrieves business context and requirements<color:#8D8D8D>"
SoftwareFactoryOrchestrationEngine .[#8D8D8D,thickness=2].> SoftwareFactoryContextManager : "<color:#8D8D8D>Accesses business context<color:#8D8D8D>"
@enduml
`;default:throw new Error("Unknown viewId: "+n)}}export{o as pumlSource};
