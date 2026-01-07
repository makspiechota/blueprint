function t(e){switch(e){case"index":return`digraph {
    graph [TBbalance=min,
        bgcolor=transparent,
        compound=true,
        fontname=Arial,
        fontsize=20,
        labeljust=l,
        labelloc=t,
        layout=dot,
        likec4_viewId=index,
        nodesep=1.528,
        outputorder=nodesfirst,
        pad=0.209,
        rankdir=TB,
        ranksep=1.667,
        splines=spline
    ];
    node [color="#2563eb",
        fillcolor="#3b82f6",
        fontcolor="#eff6ff",
        fontname=Arial,
        label="\\N",
        penwidth=0,
        shape=rect,
        style=filled
    ];
    edge [arrowsize=0.75,
        color="#8D8D8D",
        fontcolor="#C9C9C9",
        fontname=Arial,
        fontsize=14,
        penwidth=2
    ];
    subgraph cluster_softwarefactory {
        graph [color="#1b3d88",
            fillcolor="#194b9e",
            label=<<FONT POINT-SIZE="11" COLOR="#bfdbfeb3"><B>SOFTWARE FACTORY PLATFORM</B></FONT>>,
            likec4_depth=1,
            likec4_id=softwareFactory,
            likec4_level=0,
            margin=40,
            style=filled
        ];
        dashboard [color="#2d5d39",
            fillcolor="#428a4f",
            fontcolor="#f8fafc",
            group=softwareFactory,
            height=2.5,
            label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Dashboard UI</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#c2f0c2">React-based web interface for workflow<BR/>configuration, monitoring, and oversight</FONT></TD></TR></TABLE>>,
            likec4_id="softwareFactory.dashboard",
            likec4_level=1,
            margin="0.223,0.223",
            width=4.445];
        orchestrationengine [color="#2d5d39",
            fillcolor="#428a4f",
            fontcolor="#f8fafc",
            group=softwareFactory,
            height=2.5,
            label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Orchestration Engine</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#c2f0c2">Backend service coordinating AI agents<BR/>through SDLC phases</FONT></TD></TR></TABLE>>,
            likec4_id="softwareFactory.orchestrationEngine",
            likec4_level=1,
            margin="0.223,0.223",
            width=4.445];
        contextmanager [color="#2d5d39",
            fillcolor="#428a4f",
            fontcolor="#f8fafc",
            group=softwareFactory,
            height=2.5,
            label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Context Manager</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#c2f0c2">Integration layer with Blueprint system for<BR/>business context</FONT></TD></TR></TABLE>>,
            likec4_id="softwareFactory.contextManager",
            likec4_level=1,
            margin="0.223,0.223",
            width=4.445];
        datastore [color="#2d5d39",
            fillcolor="#428a4f",
            fontcolor="#f8fafc",
            group=softwareFactory,
            height=2.5,
            label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Data Store</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#c2f0c2">Persistent storage for workflows,<BR/>configurations, and artifacts</FONT></TD></TR></TABLE>>,
            likec4_id="softwareFactory.dataStore",
            likec4_level=1,
            margin="0.223,0.223",
            width=4.445];
        airuntime [color="#2d5d39",
            fillcolor="#428a4f",
            fontcolor="#f8fafc",
            group=softwareFactory,
            height=2.5,
            label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">AI Agent Runtime</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#c2f0c2">Execution environment for AI development<BR/>agents</FONT></TD></TR></TABLE>>,
            likec4_id="softwareFactory.aiRuntime",
            likec4_level=1,
            margin="0.223,0.223",
            width=4.445];
    }
    engineer [color="#7E451D",
        fillcolor="#A35829",
        fontcolor="#FFE0C2",
        height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Engineer</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#f9b27c">Software engineer overseeing autonomous SDLC<BR/>workflows</FONT></TD></TR></TABLE>>,
        likec4_id=engineer,
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    engineer -> dashboard [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Configures and monitors AI workflows</FONT></TD></TR></TABLE>>,
        likec4_id=sx26n6,
        minlen=1,
        style=dashed];
    teamlead [color="#7E451D",
        fillcolor="#A35829",
        fontcolor="#FFE0C2",
        height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Team Lead</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#f9b27c">Engineering manager configuring and<BR/>monitoring AI workflows</FONT></TD></TR></TABLE>>,
        likec4_id=teamLead,
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    teamlead -> dashboard [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Oversees autonomous development<BR/>processes</FONT></TD></TR></TABLE>>,
        likec4_id="5jv6zu",
        minlen=1,
        style=dashed];
    architect [color="#7E451D",
        fillcolor="#A35829",
        fontcolor="#FFE0C2",
        height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">System Architect</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#f9b27c">Technical architect designing autonomous<BR/>development processes</FONT></TD></TR></TABLE>>,
        likec4_id=architect,
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    architect -> dashboard [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Designs workflow templates and quality<BR/>gates</FONT></TD></TR></TABLE>>,
        likec4_id=1060970,
        minlen=1,
        style=dashed];
    devops [color="#7E451D",
        fillcolor="#A35829",
        fontcolor="#FFE0C2",
        height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">DevOps Engineer</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#f9b27c">Infrastructure and deployment specialist</FONT></TD></TR></TABLE>>,
        likec4_id=devops,
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    devops -> dashboard [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Manages deployment configurations and<BR/>monitoring</FONT></TD></TR></TABLE>>,
        likec4_id=y93i68,
        minlen=1,
        style=dashed];
    monitoring [color="#525252",
        fillcolor="#737373",
        fontcolor="#fafafa",
        height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Monitoring System</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#d4d4d4">Application performance monitoring and<BR/>alerting</FONT></TD></TR></TABLE>>,
        likec4_id=monitoring,
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    monitoring -> dashboard [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Provides monitoring data</FONT></TD></TR></TABLE>>,
        likec4_id="1gsnvg7",
        style=dashed];
    dashboard -> orchestrationengine [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Sends workflow configurations</FONT></TD></TR></TABLE>>,
        likec4_id="1e1ck6z",
        style=dashed,
        weight=2];
    orchestrationengine -> monitoring [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Sends health and performance metrics</FONT></TD></TR></TABLE>>,
        likec4_id="9p2pmu",
        style=dashed];
    orchestrationengine -> contextmanager [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Accesses business context</FONT></TD></TR></TABLE>>,
        likec4_id="166d3sj",
        style=dashed,
        weight=2];
    orchestrationengine -> datastore [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Persists configurations and artifacts</FONT></TD></TR></TABLE>>,
        likec4_id=i0ihqo,
        minlen=1,
        style=dashed,
        weight=2];
    orchestrationengine -> airuntime [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Orchestrates AI agent execution</FONT></TD></TR></TABLE>>,
        likec4_id=c194kr,
        style=dashed,
        weight=2];
    contextmanager -> airuntime [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Provides technical specs</FONT></TD></TR></TABLE>>,
        likec4_id="1kexbyq",
        style=dashed,
        weight=2];
    blueprintsystem [color="#525252",
        fillcolor="#737373",
        fontcolor="#fafafa",
        height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Blueprint Context System</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#d4d4d4">Structured business context and requirements<BR/>management</FONT></TD></TR></TABLE>>,
        likec4_id=blueprintSystem,
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    contextmanager -> blueprintsystem [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Retrieves business context and<BR/>requirements</FONT></TD></TR></TABLE>>,
        likec4_id="927tax",
        minlen=1,
        style=dashed];
    aiprovider [color="#525252",
        fillcolor="#737373",
        fontcolor="#fafafa",
        height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">AI Provider</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#d4d4d4">Claude Code, OpenAI GPT, or other AI coding<BR/>assistants</FONT></TD></TR></TABLE>>,
        likec4_id=aiProvider,
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    airuntime -> aiprovider [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Executes AI-powered development tasks</FONT></TD></TR></TABLE>>,
        likec4_id=q1fede,
        minlen=1,
        style=dashed];
    gitrepo [color="#525252",
        fillcolor="#737373",
        fontcolor="#fafafa",
        height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Git Repository</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#d4d4d4">Version control for generated code and<BR/>configurations</FONT></TD></TR></TABLE>>,
        likec4_id=gitRepo,
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    airuntime -> gitrepo [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Commits generated code</FONT></TD></TR></TABLE>>,
        likec4_id="1vbvsah",
        minlen=1,
        style=dashed];
    cicd [color="#525252",
        fillcolor="#737373",
        fontcolor="#fafafa",
        height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">CI/CD Pipeline</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#d4d4d4">Continuous integration and deployment systems</FONT></TD></TR></TABLE>>,
        likec4_id=cicd,
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    airuntime -> cicd [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Triggers automated builds</FONT></TD></TR></TABLE>>,
        likec4_id=dz6y1y,
        minlen=1,
        style=dashed];
    testframework [color="#525252",
        fillcolor="#737373",
        fontcolor="#fafafa",
        height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Testing Framework</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#d4d4d4">TestZeus or other autonomous testing<BR/>platforms</FONT></TD></TR></TABLE>>,
        likec4_id=testFramework,
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    airuntime -> testframework [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Runs autonomous testing</FONT></TD></TR></TABLE>>,
        likec4_id="271jj5",
        minlen=1,
        style=dashed];
}
`;case"containers":return`digraph {
    graph [TBbalance=min,
        bgcolor=transparent,
        compound=true,
        fontname=Arial,
        fontsize=20,
        labeljust=l,
        labelloc=t,
        layout=dot,
        likec4_viewId=containers,
        nodesep=1.528,
        outputorder=nodesfirst,
        pad=0.209,
        rankdir=TB,
        ranksep=1.667,
        splines=spline
    ];
    node [color="#2563eb",
        fillcolor="#3b82f6",
        fontcolor="#eff6ff",
        fontname=Arial,
        label="\\N",
        penwidth=0,
        shape=rect,
        style=filled
    ];
    edge [arrowsize=0.75,
        color="#8D8D8D",
        fontcolor="#C9C9C9",
        fontname=Arial,
        fontsize=14,
        penwidth=2
    ];
    subgraph cluster_softwarefactory {
        graph [color="#1b3d88",
            fillcolor="#194b9e",
            label=<<FONT POINT-SIZE="11" COLOR="#bfdbfeb3"><B>SOFTWARE FACTORY PLATFORM</B></FONT>>,
            likec4_depth=1,
            likec4_id=softwareFactory,
            likec4_level=0,
            margin=40,
            style=filled
        ];
        dashboard [color="#2d5d39",
            fillcolor="#428a4f",
            fontcolor="#f8fafc",
            group=softwareFactory,
            height=2.5,
            label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Dashboard UI</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#c2f0c2">React-based web interface for workflow<BR/>configuration, monitoring, and oversight</FONT></TD></TR></TABLE>>,
            likec4_id="softwareFactory.dashboard",
            likec4_level=1,
            margin="0.223,0.223",
            width=4.445];
        orchestrationengine [color="#2d5d39",
            fillcolor="#428a4f",
            fontcolor="#f8fafc",
            group=softwareFactory,
            height=2.5,
            label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Orchestration Engine</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#c2f0c2">Backend service coordinating AI agents<BR/>through SDLC phases</FONT></TD></TR></TABLE>>,
            likec4_id="softwareFactory.orchestrationEngine",
            likec4_level=1,
            margin="0.223,0.223",
            width=4.445];
        contextmanager [color="#2d5d39",
            fillcolor="#428a4f",
            fontcolor="#f8fafc",
            group=softwareFactory,
            height=2.5,
            label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Context Manager</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#c2f0c2">Integration layer with Blueprint system for<BR/>business context</FONT></TD></TR></TABLE>>,
            likec4_id="softwareFactory.contextManager",
            likec4_level=1,
            margin="0.223,0.223",
            width=4.445];
        datastore [color="#2d5d39",
            fillcolor="#428a4f",
            fontcolor="#f8fafc",
            group=softwareFactory,
            height=2.5,
            label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Data Store</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#c2f0c2">Persistent storage for workflows,<BR/>configurations, and artifacts</FONT></TD></TR></TABLE>>,
            likec4_id="softwareFactory.dataStore",
            likec4_level=1,
            margin="0.223,0.223",
            width=4.445];
        airuntime [color="#2d5d39",
            fillcolor="#428a4f",
            fontcolor="#f8fafc",
            group=softwareFactory,
            height=2.5,
            label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">AI Agent Runtime</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#c2f0c2">Execution environment for AI development<BR/>agents</FONT></TD></TR></TABLE>>,
            likec4_id="softwareFactory.aiRuntime",
            likec4_level=1,
            margin="0.223,0.223",
            width=4.445];
    }
    engineer [color="#7E451D",
        fillcolor="#A35829",
        fontcolor="#FFE0C2",
        height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Engineer</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#f9b27c">Software engineer overseeing autonomous SDLC<BR/>workflows</FONT></TD></TR></TABLE>>,
        likec4_id=engineer,
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    engineer -> dashboard [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Configures and monitors AI workflows</FONT></TD></TR></TABLE>>,
        likec4_id=sx26n6,
        minlen=1,
        style=dashed];
    teamlead [color="#7E451D",
        fillcolor="#A35829",
        fontcolor="#FFE0C2",
        height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Team Lead</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#f9b27c">Engineering manager configuring and<BR/>monitoring AI workflows</FONT></TD></TR></TABLE>>,
        likec4_id=teamLead,
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    teamlead -> dashboard [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Oversees autonomous development<BR/>processes</FONT></TD></TR></TABLE>>,
        likec4_id="5jv6zu",
        minlen=1,
        style=dashed];
    architect [color="#7E451D",
        fillcolor="#A35829",
        fontcolor="#FFE0C2",
        height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">System Architect</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#f9b27c">Technical architect designing autonomous<BR/>development processes</FONT></TD></TR></TABLE>>,
        likec4_id=architect,
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    architect -> dashboard [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Designs workflow templates and quality<BR/>gates</FONT></TD></TR></TABLE>>,
        likec4_id=1060970,
        minlen=1,
        style=dashed];
    devops [color="#7E451D",
        fillcolor="#A35829",
        fontcolor="#FFE0C2",
        height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">DevOps Engineer</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#f9b27c">Infrastructure and deployment specialist</FONT></TD></TR></TABLE>>,
        likec4_id=devops,
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    devops -> dashboard [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Manages deployment configurations and<BR/>monitoring</FONT></TD></TR></TABLE>>,
        likec4_id=y93i68,
        minlen=1,
        style=dashed];
    dashboard -> orchestrationengine [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Sends workflow configurations</FONT></TD></TR></TABLE>>,
        likec4_id="1e1ck6z",
        style=dashed,
        weight=2];
    orchestrationengine -> contextmanager [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Accesses business context</FONT></TD></TR></TABLE>>,
        likec4_id="166d3sj",
        style=dashed,
        weight=2];
    orchestrationengine -> datastore [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Persists configurations and artifacts</FONT></TD></TR></TABLE>>,
        likec4_id=i0ihqo,
        minlen=1,
        style=dashed,
        weight=2];
    monitoring [color="#525252",
        fillcolor="#737373",
        fontcolor="#fafafa",
        height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Monitoring System</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#d4d4d4">Application performance monitoring and<BR/>alerting</FONT></TD></TR></TABLE>>,
        likec4_id=monitoring,
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    orchestrationengine -> monitoring [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Sends health and performance metrics</FONT></TD></TR></TABLE>>,
        likec4_id="9p2pmu",
        style=dashed];
    orchestrationengine -> airuntime [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Orchestrates AI agent execution</FONT></TD></TR></TABLE>>,
        likec4_id=c194kr,
        style=dashed,
        weight=2];
    contextmanager -> airuntime [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Provides technical specs</FONT></TD></TR></TABLE>>,
        likec4_id="1kexbyq",
        style=dashed,
        weight=2];
    blueprintsystem [color="#525252",
        fillcolor="#737373",
        fontcolor="#fafafa",
        height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Blueprint Context System</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#d4d4d4">Structured business context and requirements<BR/>management</FONT></TD></TR></TABLE>>,
        likec4_id=blueprintSystem,
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    contextmanager -> blueprintsystem [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Retrieves business context and<BR/>requirements</FONT></TD></TR></TABLE>>,
        likec4_id="927tax",
        minlen=1,
        style=dashed];
    monitoring -> dashboard [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Provides monitoring data</FONT></TD></TR></TABLE>>,
        likec4_id="1gsnvg7",
        style=dashed];
    aiprovider [color="#525252",
        fillcolor="#737373",
        fontcolor="#fafafa",
        height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">AI Provider</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#d4d4d4">Claude Code, OpenAI GPT, or other AI coding<BR/>assistants</FONT></TD></TR></TABLE>>,
        likec4_id=aiProvider,
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    airuntime -> aiprovider [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Executes AI-powered development tasks</FONT></TD></TR></TABLE>>,
        likec4_id=q1fede,
        minlen=1,
        style=dashed];
    gitrepo [color="#525252",
        fillcolor="#737373",
        fontcolor="#fafafa",
        height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Git Repository</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#d4d4d4">Version control for generated code and<BR/>configurations</FONT></TD></TR></TABLE>>,
        likec4_id=gitRepo,
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    airuntime -> gitrepo [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Commits generated code</FONT></TD></TR></TABLE>>,
        likec4_id="1vbvsah",
        minlen=1,
        style=dashed];
    cicd [color="#525252",
        fillcolor="#737373",
        fontcolor="#fafafa",
        height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">CI/CD Pipeline</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#d4d4d4">Continuous integration and deployment systems</FONT></TD></TR></TABLE>>,
        likec4_id=cicd,
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    airuntime -> cicd [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Triggers automated builds</FONT></TD></TR></TABLE>>,
        likec4_id=dz6y1y,
        minlen=1,
        style=dashed];
    testframework [color="#525252",
        fillcolor="#737373",
        fontcolor="#fafafa",
        height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Testing Framework</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#d4d4d4">TestZeus or other autonomous testing<BR/>platforms</FONT></TD></TR></TABLE>>,
        likec4_id=testFramework,
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    airuntime -> testframework [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Runs autonomous testing</FONT></TD></TR></TABLE>>,
        likec4_id="271jj5",
        minlen=1,
        style=dashed];
}
`;case"orchestrationComponents":return`digraph {
    graph [TBbalance=min,
        bgcolor=transparent,
        compound=true,
        fontname=Arial,
        fontsize=20,
        labeljust=l,
        labelloc=t,
        layout=dot,
        likec4_viewId=orchestrationComponents,
        nodesep=1.528,
        outputorder=nodesfirst,
        pad=0.209,
        rankdir=TB,
        ranksep=1.667,
        splines=spline
    ];
    node [color="#2563eb",
        fillcolor="#3b82f6",
        fontcolor="#eff6ff",
        fontname=Arial,
        label="\\N",
        penwidth=0,
        shape=rect,
        style=filled
    ];
    edge [arrowsize=0.75,
        color="#8D8D8D",
        fontcolor="#C9C9C9",
        fontname=Arial,
        fontsize=14,
        penwidth=2
    ];
    subgraph cluster_orchestrationengine {
        graph [color="#1e3524",
            fillcolor="#2c4e32",
            label=<<FONT POINT-SIZE="11" COLOR="#c2f0c2b3"><B>ORCHESTRATION ENGINE</B></FONT>>,
            likec4_depth=1,
            likec4_id="softwareFactory.orchestrationEngine",
            likec4_level=0,
            margin=40,
            style=filled
        ];
        workfloworchestrator [color="#475569",
            fillcolor="#64748b",
            fontcolor="#f8fafc",
            height=2.5,
            label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Workflow Orchestrator</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#cbd5e1">Manages execution flow through planning,<BR/>development, testing, deployment phases</FONT></TD></TR></TABLE>>,
            likec4_id="softwareFactory.orchestrationEngine.workflowOrchestrator",
            likec4_level=1,
            margin="0.223,0.223",
            width=4.445];
        agentcoordinator [color="#475569",
            fillcolor="#64748b",
            fontcolor="#f8fafc",
            height=2.5,
            label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Agent Coordinator</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#cbd5e1">Manages multiple AI agents and their<BR/>interactions</FONT></TD></TR></TABLE>>,
            likec4_id="softwareFactory.orchestrationEngine.agentCoordinator",
            likec4_level=1,
            margin="0.223,0.223",
            width=4.445];
        qualitygate [color="#475569",
            fillcolor="#64748b",
            fontcolor="#f8fafc",
            height=2.5,
            label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Quality Gate</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#cbd5e1">Automated code review and validation<BR/>checkpoints</FONT></TD></TR></TABLE>>,
            likec4_id="softwareFactory.orchestrationEngine.qualityGate",
            likec4_level=1,
            margin="0.223,0.223",
            width=4.445];
        deploymentmanager [color="#475569",
            fillcolor="#64748b",
            fontcolor="#f8fafc",
            height=2.5,
            label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Deployment Manager</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#cbd5e1">Handles automated deployment with feature<BR/>flags</FONT></TD></TR></TABLE>>,
            likec4_id="softwareFactory.orchestrationEngine.deploymentManager",
            likec4_level=1,
            margin="0.223,0.223",
            width=4.445];
    }
    dashboard [color="#2d5d39",
        fillcolor="#428a4f",
        fontcolor="#f8fafc",
        height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Dashboard UI</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#c2f0c2">React-based web interface for workflow<BR/>configuration, monitoring, and oversight</FONT></TD></TR></TABLE>>,
        likec4_id="softwareFactory.dashboard",
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    dashboard -> workfloworchestrator [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14"><B>[...]</B></FONT></TD></TR></TABLE>>,
        likec4_id="1wnrqg8",
        style=dashed];
    dashboard -> agentcoordinator [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Monitors agents</FONT></TD></TR></TABLE>>,
        likec4_id=dcu2fq,
        minlen=1,
        style=dashed];
    airuntime [color="#2d5d39",
        fillcolor="#428a4f",
        fontcolor="#f8fafc",
        height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">AI Agent Runtime</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#c2f0c2">Execution environment for AI development<BR/>agents</FONT></TD></TR></TABLE>>,
        likec4_id="softwareFactory.aiRuntime",
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    workfloworchestrator -> airuntime [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Initiates development</FONT></TD></TR></TABLE>>,
        likec4_id=cw2e3c,
        style=dashed];
    qualitygate -> airuntime [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Triggers review</FONT></TD></TR></TABLE>>,
        likec4_id=kr9z1b,
        minlen=1,
        style=dashed];
    contextmanager [color="#2d5d39",
        fillcolor="#428a4f",
        fontcolor="#f8fafc",
        height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Context Manager</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#c2f0c2">Integration layer with Blueprint system for<BR/>business context</FONT></TD></TR></TABLE>>,
        likec4_id="softwareFactory.contextManager",
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    deploymentmanager -> contextmanager [arrowhead=normal,
        likec4_id="166d3sj",
        ltail=cluster_orchestrationengine,
        style=dashed,
        xlabel=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Accesses business context</FONT></TD></TR></TABLE>>];
    deploymentmanager -> airuntime [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Manages deployment</FONT></TD></TR></TABLE>>,
        likec4_id=nvkgwf,
        style=dashed];
    contextmanager -> airuntime [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Provides technical specs</FONT></TD></TR></TABLE>>,
        likec4_id="1kexbyq",
        minlen=0,
        style=dashed,
        weight=2];
}
`;case"aiAgents":return`digraph {
    graph [TBbalance=min,
        bgcolor=transparent,
        compound=true,
        fontname=Arial,
        fontsize=20,
        labeljust=l,
        labelloc=t,
        layout=dot,
        likec4_viewId=aiAgents,
        nodesep=1.528,
        outputorder=nodesfirst,
        pad=0.209,
        rankdir=TB,
        ranksep=1.667,
        splines=spline
    ];
    node [color="#2563eb",
        fillcolor="#3b82f6",
        fontcolor="#eff6ff",
        fontname=Arial,
        label="\\N",
        penwidth=0,
        shape=rect,
        style=filled
    ];
    edge [arrowsize=0.75,
        color="#8D8D8D",
        fontcolor="#C9C9C9",
        fontname=Arial,
        fontsize=14,
        penwidth=2
    ];
    subgraph cluster_airuntime {
        graph [color="#1e3524",
            fillcolor="#2c4e32",
            label=<<FONT POINT-SIZE="11" COLOR="#c2f0c2b3"><B>AI AGENT RUNTIME</B></FONT>>,
            likec4_depth=1,
            likec4_id="softwareFactory.aiRuntime",
            likec4_level=0,
            margin=40,
            style=filled
        ];
        testgenerator [color="#475569",
            fillcolor="#64748b",
            fontcolor="#f8fafc",
            height=2.5,
            label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Test Generator Agent</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#cbd5e1">AI agent that creates comprehensive test<BR/>suites</FONT></TD></TR></TABLE>>,
            likec4_id="softwareFactory.aiRuntime.testGenerator",
            likec4_level=1,
            margin="0.223,0.223",
            width=4.445];
        codegenerator [color="#475569",
            fillcolor="#64748b",
            fontcolor="#f8fafc",
            height=2.5,
            label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Code Generator Agent</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#cbd5e1">AI agent responsible for autonomous code<BR/>generation and refactoring</FONT></TD></TR></TABLE>>,
            likec4_id="softwareFactory.aiRuntime.codeGenerator",
            likec4_level=1,
            margin="0.223,0.223",
            width=4.445];
        revieweragent [color="#475569",
            fillcolor="#64748b",
            fontcolor="#f8fafc",
            height=2.5,
            label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Code Review Agent</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#cbd5e1">AI agent performing automated code quality<BR/>assessment</FONT></TD></TR></TABLE>>,
            likec4_id="softwareFactory.aiRuntime.reviewerAgent",
            likec4_level=1,
            margin="0.223,0.223",
            width=4.445];
        deploymentagent [color="#475569",
            fillcolor="#64748b",
            fontcolor="#f8fafc",
            height=2.5,
            label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Deployment Agent</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#cbd5e1">AI agent managing deployment automation and<BR/>rollback</FONT></TD></TR></TABLE>>,
            likec4_id="softwareFactory.aiRuntime.deploymentAgent",
            likec4_level=1,
            margin="0.223,0.223",
            width=4.445];
    }
    orchestrationengine [color="#2d5d39",
        fillcolor="#428a4f",
        fontcolor="#f8fafc",
        height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Orchestration Engine</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#c2f0c2">Backend service coordinating AI agents<BR/>through SDLC phases</FONT></TD></TR></TABLE>>,
        likec4_id="softwareFactory.orchestrationEngine",
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    orchestrationengine -> codegenerator [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Initiates development</FONT></TD></TR></TABLE>>,
        likec4_id=r0f55n,
        minlen=1,
        style=dashed];
    orchestrationengine -> revieweragent [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Triggers review</FONT></TD></TR></TABLE>>,
        likec4_id=lai13l,
        minlen=1,
        style=dashed];
    orchestrationengine -> deploymentagent [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Manages deployment</FONT></TD></TR></TABLE>>,
        likec4_id=nzqcg5,
        style=dashed];
    aiprovider [color="#525252",
        fillcolor="#737373",
        fontcolor="#fafafa",
        height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">AI Provider</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#d4d4d4">Claude Code, OpenAI GPT, or other AI coding<BR/>assistants</FONT></TD></TR></TABLE>>,
        likec4_id=aiProvider,
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    deploymentagent -> aiprovider [arrowhead=normal,
        likec4_id=q1fede,
        ltail=cluster_airuntime,
        minlen=1,
        style=dashed,
        xlabel=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Executes AI-powered development tasks</FONT></TD></TR></TABLE>>];
    gitrepo [color="#525252",
        fillcolor="#737373",
        fontcolor="#fafafa",
        height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Git Repository</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#d4d4d4">Version control for generated code and<BR/>configurations</FONT></TD></TR></TABLE>>,
        likec4_id=gitRepo,
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    deploymentagent -> gitrepo [arrowhead=normal,
        likec4_id="1vbvsah",
        ltail=cluster_airuntime,
        minlen=1,
        style=dashed,
        xlabel=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Commits generated code</FONT></TD></TR></TABLE>>];
    cicd [color="#525252",
        fillcolor="#737373",
        fontcolor="#fafafa",
        height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">CI/CD Pipeline</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#d4d4d4">Continuous integration and deployment systems</FONT></TD></TR></TABLE>>,
        likec4_id=cicd,
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    deploymentagent -> cicd [arrowhead=normal,
        likec4_id=dz6y1y,
        ltail=cluster_airuntime,
        minlen=1,
        style=dashed,
        xlabel=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Triggers automated builds</FONT></TD></TR></TABLE>>];
    testframework [color="#525252",
        fillcolor="#737373",
        fontcolor="#fafafa",
        height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Testing Framework</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#d4d4d4">TestZeus or other autonomous testing<BR/>platforms</FONT></TD></TR></TABLE>>,
        likec4_id=testFramework,
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    deploymentagent -> testframework [arrowhead=normal,
        likec4_id="271jj5",
        ltail=cluster_airuntime,
        minlen=1,
        style=dashed,
        xlabel=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Runs autonomous testing</FONT></TD></TR></TABLE>>];
}
`;case"dashboardComponents":return`digraph {
    graph [TBbalance=min,
        bgcolor=transparent,
        compound=true,
        fontname=Arial,
        fontsize=20,
        labeljust=l,
        labelloc=t,
        layout=dot,
        likec4_viewId=dashboardComponents,
        nodesep=1.528,
        outputorder=nodesfirst,
        pad=0.209,
        rankdir=TB,
        ranksep=1.667,
        splines=spline
    ];
    node [color="#2563eb",
        fillcolor="#3b82f6",
        fontcolor="#eff6ff",
        fontname=Arial,
        label="\\N",
        penwidth=0,
        shape=rect,
        style=filled
    ];
    edge [arrowsize=0.75,
        color="#8D8D8D",
        fontcolor="#C9C9C9",
        fontname=Arial,
        fontsize=14,
        penwidth=2
    ];
    subgraph cluster_dashboard {
        graph [color="#1e3524",
            fillcolor="#2c4e32",
            label=<<FONT POINT-SIZE="11" COLOR="#c2f0c2b3"><B>DASHBOARD UI</B></FONT>>,
            likec4_depth=1,
            likec4_id="softwareFactory.dashboard",
            likec4_level=0,
            margin=40,
            style=filled
        ];
        blueprintviewer [color="#475569",
            fillcolor="#64748b",
            fontcolor="#f8fafc",
            height=2.5,
            label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Blueprint Viewer</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#cbd5e1">Integration with Blueprint system for context<BR/>visualization</FONT></TD></TR></TABLE>>,
            likec4_id="softwareFactory.dashboard.blueprintViewer",
            likec4_level=1,
            margin="0.223,0.223",
            width=4.445];
        workflowdesigner [color="#475569",
            fillcolor="#64748b",
            fontcolor="#f8fafc",
            height=2.5,
            label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Workflow Designer</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#cbd5e1">No-code visual designer for configuring AI<BR/>agent workflows</FONT></TD></TR></TABLE>>,
            likec4_id="softwareFactory.dashboard.workflowDesigner",
            likec4_level=1,
            margin="0.223,0.223",
            width=4.445];
        backlogmanager [color="#475569",
            fillcolor="#64748b",
            fontcolor="#f8fafc",
            height=2.5,
            label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Backlog Manager</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#cbd5e1">Task scheduling and prioritization interface<BR/>for AI agents</FONT></TD></TR></TABLE>>,
            likec4_id="softwareFactory.dashboard.backlogManager",
            likec4_level=1,
            margin="0.223,0.223",
            width=4.445];
        monitoringdashboard [color="#475569",
            fillcolor="#64748b",
            fontcolor="#f8fafc",
            height=2.5,
            label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Monitoring Dashboard</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#cbd5e1">Real-time monitoring of AI agent activities<BR/>and system health</FONT></TD></TR></TABLE>>,
            likec4_id="softwareFactory.dashboard.monitoringDashboard",
            likec4_level=1,
            margin="0.223,0.223",
            width=4.445];
    }
    engineer [color="#7E451D",
        fillcolor="#A35829",
        fontcolor="#FFE0C2",
        height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Engineer</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#f9b27c">Software engineer overseeing autonomous SDLC<BR/>workflows</FONT></TD></TR></TABLE>>,
        likec4_id=engineer,
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    engineer -> blueprintviewer [arrowhead=normal,
        lhead=cluster_dashboard,
        likec4_id=sx26n6,
        minlen=1,
        style=dashed,
        xlabel=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Configures and monitors AI workflows</FONT></TD></TR></TABLE>>];
    teamlead [color="#7E451D",
        fillcolor="#A35829",
        fontcolor="#FFE0C2",
        height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Team Lead</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#f9b27c">Engineering manager configuring and<BR/>monitoring AI workflows</FONT></TD></TR></TABLE>>,
        likec4_id=teamLead,
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    teamlead -> blueprintviewer [arrowhead=normal,
        lhead=cluster_dashboard,
        likec4_id="5jv6zu",
        minlen=1,
        style=dashed,
        xlabel=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Oversees autonomous development<BR/>processes</FONT></TD></TR></TABLE>>];
    architect [color="#7E451D",
        fillcolor="#A35829",
        fontcolor="#FFE0C2",
        height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">System Architect</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#f9b27c">Technical architect designing autonomous<BR/>development processes</FONT></TD></TR></TABLE>>,
        likec4_id=architect,
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    architect -> blueprintviewer [arrowhead=normal,
        lhead=cluster_dashboard,
        likec4_id=1060970,
        minlen=1,
        style=dashed,
        xlabel=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Designs workflow templates and quality<BR/>gates</FONT></TD></TR></TABLE>>];
    devops [color="#7E451D",
        fillcolor="#A35829",
        fontcolor="#FFE0C2",
        height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">DevOps Engineer</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#f9b27c">Infrastructure and deployment specialist</FONT></TD></TR></TABLE>>,
        likec4_id=devops,
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    devops -> blueprintviewer [arrowhead=normal,
        lhead=cluster_dashboard,
        likec4_id=y93i68,
        minlen=1,
        style=dashed,
        xlabel=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Manages deployment configurations and<BR/>monitoring</FONT></TD></TR></TABLE>>];
    orchestrationengine [color="#2d5d39",
        fillcolor="#428a4f",
        fontcolor="#f8fafc",
        height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Orchestration Engine</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#c2f0c2">Backend service coordinating AI agents<BR/>through SDLC phases</FONT></TD></TR></TABLE>>,
        likec4_id="softwareFactory.orchestrationEngine",
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    workflowdesigner -> orchestrationengine [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Defines workflows</FONT></TD></TR></TABLE>>,
        likec4_id="15ldxpf",
        minlen=1,
        style=dashed];
    backlogmanager -> orchestrationengine [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Schedules tasks</FONT></TD></TR></TABLE>>,
        likec4_id="1uktzvt",
        minlen=1,
        style=dashed];
    monitoringdashboard -> orchestrationengine [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Monitors agents</FONT></TD></TR></TABLE>>,
        likec4_id="4ttd19",
        minlen=1,
        style=dashed];
}
`;case"contextIntegration":return`digraph {
    graph [TBbalance=min,
        bgcolor=transparent,
        clusterrank=global,
        compound=true,
        fontname=Arial,
        fontsize=20,
        labeljust=l,
        labelloc=t,
        layout=dot,
        likec4_viewId=contextIntegration,
        newrank=true,
        nodesep=1.528,
        outputorder=nodesfirst,
        pad=0.209,
        rankdir=TB,
        ranksep=1.667,
        splines=spline
    ];
    node [color="#2563eb",
        fillcolor="#3b82f6",
        fontcolor="#eff6ff",
        fontname=Arial,
        label="\\N",
        penwidth=0,
        shape=rect,
        style=filled
    ];
    edge [arrowsize=0.75,
        color="#8D8D8D",
        fontcolor="#C9C9C9",
        fontname=Arial,
        fontsize=14,
        penwidth=2
    ];
    subgraph cluster_contextmanager {
        graph [color="#1e3524",
            fillcolor="#2c4e32",
            label=<<FONT POINT-SIZE="11" COLOR="#c2f0c2b3"><B>CONTEXT MANAGER</B></FONT>>,
            likec4_depth=1,
            likec4_id="softwareFactory.contextManager",
            likec4_level=0,
            margin=40,
            style=filled
        ];
        {
            graph [rank=same];
            blueprintintegrator [color="#475569",
                fillcolor="#64748b",
                fontcolor="#f8fafc",
                height=2.5,
                label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Blueprint Integrator</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#cbd5e1">API client for accessing structured business<BR/>requirements and context</FONT></TD></TR></TABLE>>,
                likec4_id="softwareFactory.contextManager.blueprintIntegrator",
                likec4_level=1,
                margin="0.223,0.223",
                width=4.445];
            contextcache [color="#475569",
                fillcolor="#64748b",
                fontcolor="#f8fafc",
                height=2.5,
                label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Context Cache</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#cbd5e1">Local caching of blueprint data for AI agent<BR/>access</FONT></TD></TR></TABLE>>,
                likec4_id="softwareFactory.contextManager.contextCache",
                likec4_level=1,
                margin="0.223,0.223",
                width=4.445];
        }
        requirementmapper [color="#475569",
            fillcolor="#64748b",
            fontcolor="#f8fafc",
            height=2.5,
            label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Requirement Mapper</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#cbd5e1">Translates business requirements into<BR/>technical specifications</FONT></TD></TR></TABLE>>,
            likec4_id="softwareFactory.contextManager.requirementMapper",
            likec4_level=1,
            margin="0.223,0.223",
            width=4.445];
        blueprintintegrator -> requirementmapper [style=invis];
    }
    blueprintsystem [color="#525252",
        fillcolor="#737373",
        fontcolor="#fafafa",
        height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Blueprint Context System</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#d4d4d4">Structured business context and requirements<BR/>management</FONT></TD></TR></TABLE>>,
        likec4_id=blueprintSystem,
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    requirementmapper -> blueprintsystem [arrowhead=normal,
        likec4_id="927tax",
        ltail=cluster_contextmanager,
        minlen=1,
        style=dashed,
        xlabel=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Retrieves business context and<BR/>requirements</FONT></TD></TR></TABLE>>];
    orchestrationengine [color="#2d5d39",
        fillcolor="#428a4f",
        fontcolor="#f8fafc",
        height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Orchestration Engine</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#c2f0c2">Backend service coordinating AI agents<BR/>through SDLC phases</FONT></TD></TR></TABLE>>,
        likec4_id="softwareFactory.orchestrationEngine",
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    orchestrationengine -> blueprintintegrator [arrowhead=normal,
        lhead=cluster_contextmanager,
        likec4_id="166d3sj",
        minlen=1,
        style=dashed,
        weight=2,
        xlabel=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Accesses business context</FONT></TD></TR></TABLE>>];
}
`;default:throw new Error("Unknown viewId: "+e)}}function n(e){switch(e){case"index":return`<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"
 "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<!-- Generated by graphviz version 14.0.4 (0)
 -->
<!-- Pages: 1 -->
<svg width="1944pt" height="1867pt"
 viewBox="0.00 0.00 1944.00 1867.00" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g id="graph0" class="graph" transform="scale(1 1) rotate(0) translate(15.05 1851.85)">
<g id="clust1" class="cluster">
<title>cluster_softwarefactory</title>
<polygon fill="#194b9e" stroke="#1b3d88" points="229.15,-282.8 229.15,-1549.2 1485.15,-1549.2 1485.15,-282.8 229.15,-282.8"/>
<text xml:space="preserve" text-anchor="start" x="237.15" y="-1536.3" font-family="Arial" font-weight="bold" font-size="11.00" fill="#bfdbfe" fill-opacity="0.701961">SOFTWARE FACTORY PLATFORM</text>
</g>
<!-- dashboard -->
<g id="node1" class="node">
<title>dashboard</title>
<polygon fill="#428a4f" stroke="#2d5d39" stroke-width="0" points="1015.17,-1488 695.13,-1488 695.13,-1308 1015.17,-1308 1015.17,-1488"/>
<text xml:space="preserve" text-anchor="start" x="793.46" y="-1412" font-family="Arial" font-size="20.00" fill="#f8fafc">Dashboard UI</text>
<text xml:space="preserve" text-anchor="start" x="723.85" y="-1388.5" font-family="Arial" font-size="15.00" fill="#c2f0c2">React&#45;based web interface for workflow</text>
<text xml:space="preserve" text-anchor="start" x="723.83" y="-1370.5" font-family="Arial" font-size="15.00" fill="#c2f0c2">configuration, monitoring, and oversight</text>
</g>
<!-- orchestrationengine -->
<g id="node2" class="node">
<title>orchestrationengine</title>
<polygon fill="#428a4f" stroke="#2d5d39" stroke-width="0" points="1015.17,-1165.2 695.13,-1165.2 695.13,-985.2 1015.17,-985.2 1015.17,-1165.2"/>
<text xml:space="preserve" text-anchor="start" x="761.21" y="-1089.2" font-family="Arial" font-size="20.00" fill="#f8fafc">Orchestration Engine</text>
<text xml:space="preserve" text-anchor="start" x="723.41" y="-1065.7" font-family="Arial" font-size="15.00" fill="#c2f0c2">Backend service coordinating AI agents</text>
<text xml:space="preserve" text-anchor="start" x="781.36" y="-1047.7" font-family="Arial" font-size="15.00" fill="#c2f0c2">through SDLC phases</text>
</g>
<!-- contextmanager -->
<g id="node3" class="node">
<title>contextmanager</title>
<polygon fill="#428a4f" stroke="#2d5d39" stroke-width="0" points="1445.17,-842.4 1125.13,-842.4 1125.13,-662.4 1445.17,-662.4 1445.17,-842.4"/>
<text xml:space="preserve" text-anchor="start" x="1208.45" y="-766.4" font-family="Arial" font-size="20.00" fill="#f8fafc">Context Manager</text>
<text xml:space="preserve" text-anchor="start" x="1147.6" y="-742.9" font-family="Arial" font-size="15.00" fill="#c2f0c2">Integration layer with Blueprint system for</text>
<text xml:space="preserve" text-anchor="start" x="1229.29" y="-724.9" font-family="Arial" font-size="15.00" fill="#c2f0c2">business context</text>
</g>
<!-- datastore -->
<g id="node4" class="node">
<title>datastore</title>
<polygon fill="#428a4f" stroke="#2d5d39" stroke-width="0" points="1015.17,-842.4 695.13,-842.4 695.13,-662.4 1015.17,-662.4 1015.17,-842.4"/>
<text xml:space="preserve" text-anchor="start" x="807.35" y="-766.4" font-family="Arial" font-size="20.00" fill="#f8fafc">Data Store</text>
<text xml:space="preserve" text-anchor="start" x="746.78" y="-742.9" font-family="Arial" font-size="15.00" fill="#c2f0c2">Persistent storage for workflows,</text>
<text xml:space="preserve" text-anchor="start" x="763.44" y="-724.9" font-family="Arial" font-size="15.00" fill="#c2f0c2">configurations, and artifacts</text>
</g>
<!-- airuntime -->
<g id="node5" class="node">
<title>airuntime</title>
<polygon fill="#428a4f" stroke="#2d5d39" stroke-width="0" points="1028.54,-502.8 705.77,-502.8 705.77,-322.8 1028.54,-322.8 1028.54,-502.8"/>
<text xml:space="preserve" text-anchor="start" x="788.78" y="-426.8" font-family="Arial" font-size="20.00" fill="#f8fafc">AI Agent Runtime</text>
<text xml:space="preserve" text-anchor="start" x="725.83" y="-403.3" font-family="Arial" font-size="15.00" fill="#c2f0c2">Execution environment for AI development</text>
<text xml:space="preserve" text-anchor="start" x="844.64" y="-385.3" font-family="Arial" font-size="15.00" fill="#c2f0c2">agents</text>
</g>
<!-- engineer -->
<g id="node6" class="node">
<title>engineer</title>
<polygon fill="#a35829" stroke="#7e451d" stroke-width="0" points="370.31,-1836.8 0,-1836.8 0,-1656.8 370.31,-1656.8 370.31,-1836.8"/>
<text xml:space="preserve" text-anchor="start" x="145.13" y="-1760.8" font-family="Arial" font-size="20.00" fill="#ffe0c2">Engineer</text>
<text xml:space="preserve" text-anchor="start" x="20.06" y="-1737.3" font-family="Arial" font-size="15.00" fill="#f9b27c">Software engineer overseeing autonomous SDLC</text>
<text xml:space="preserve" text-anchor="start" x="152.23" y="-1719.3" font-family="Arial" font-size="15.00" fill="#f9b27c">workflows</text>
</g>
<!-- teamlead -->
<g id="node7" class="node">
<title>teamlead</title>
<polygon fill="#a35829" stroke="#7e451d" stroke-width="0" points="800.17,-1836.8 480.13,-1836.8 480.13,-1656.8 800.17,-1656.8 800.17,-1836.8"/>
<text xml:space="preserve" text-anchor="start" x="589.57" y="-1760.8" font-family="Arial" font-size="20.00" fill="#ffe0c2">Team Lead</text>
<text xml:space="preserve" text-anchor="start" x="515.07" y="-1737.3" font-family="Arial" font-size="15.00" fill="#f9b27c">Engineering manager configuring and</text>
<text xml:space="preserve" text-anchor="start" x="560.96" y="-1719.3" font-family="Arial" font-size="15.00" fill="#f9b27c">monitoring AI workflows</text>
</g>
<!-- architect -->
<g id="node8" class="node">
<title>architect</title>
<polygon fill="#a35829" stroke="#7e451d" stroke-width="0" points="1230.29,-1836.8 910.02,-1836.8 910.02,-1656.8 1230.29,-1656.8 1230.29,-1836.8"/>
<text xml:space="preserve" text-anchor="start" x="995.14" y="-1760.8" font-family="Arial" font-size="20.00" fill="#ffe0c2">System Architect</text>
<text xml:space="preserve" text-anchor="start" x="930.07" y="-1737.3" font-family="Arial" font-size="15.00" fill="#f9b27c">Technical architect designing autonomous</text>
<text xml:space="preserve" text-anchor="start" x="990.94" y="-1719.3" font-family="Arial" font-size="15.00" fill="#f9b27c">development processes</text>
</g>
<!-- devops -->
<g id="node9" class="node">
<title>devops</title>
<polygon fill="#a35829" stroke="#7e451d" stroke-width="0" points="1660.17,-1836.8 1340.13,-1836.8 1340.13,-1656.8 1660.17,-1656.8 1660.17,-1836.8"/>
<text xml:space="preserve" text-anchor="start" x="1421.22" y="-1751.8" font-family="Arial" font-size="20.00" fill="#ffe0c2">DevOps Engineer</text>
<text xml:space="preserve" text-anchor="start" x="1367.59" y="-1728.3" font-family="Arial" font-size="15.00" fill="#f9b27c">Infrastructure and deployment specialist</text>
</g>
<!-- monitoring -->
<g id="node10" class="node">
<title>monitoring</title>
<polygon fill="#737373" stroke="#525252" stroke-width="0" points="1914.17,-842.4 1594.13,-842.4 1594.13,-662.4 1914.17,-662.4 1914.17,-842.4"/>
<text xml:space="preserve" text-anchor="start" x="1671.35" y="-766.4" font-family="Arial" font-size="20.00" fill="#fafafa">Monitoring System</text>
<text xml:space="preserve" text-anchor="start" x="1621.58" y="-742.9" font-family="Arial" font-size="15.00" fill="#d4d4d4">Application performance monitoring and</text>
<text xml:space="preserve" text-anchor="start" x="1729.56" y="-724.9" font-family="Arial" font-size="15.00" fill="#d4d4d4">alerting</text>
</g>
<!-- blueprintsystem -->
<g id="node11" class="node">
<title>blueprintsystem</title>
<polygon fill="#737373" stroke="#525252" stroke-width="0" points="1871.21,-502.8 1525.1,-502.8 1525.1,-322.8 1871.21,-322.8 1871.21,-502.8"/>
<text xml:space="preserve" text-anchor="start" x="1585.33" y="-426.8" font-family="Arial" font-size="20.00" fill="#fafafa">Blueprint Context System</text>
<text xml:space="preserve" text-anchor="start" x="1545.16" y="-403.3" font-family="Arial" font-size="15.00" fill="#d4d4d4">Structured business context and requirements</text>
<text xml:space="preserve" text-anchor="start" x="1654.38" y="-385.3" font-family="Arial" font-size="15.00" fill="#d4d4d4">management</text>
</g>
<!-- aiprovider -->
<g id="node12" class="node">
<title>aiprovider</title>
<polygon fill="#737373" stroke="#525252" stroke-width="0" points="372.46,-180 23.85,-180 23.85,0 372.46,0 372.46,-180"/>
<text xml:space="preserve" text-anchor="start" x="148.69" y="-104" font-family="Arial" font-size="20.00" fill="#fafafa">AI Provider</text>
<text xml:space="preserve" text-anchor="start" x="43.9" y="-80.5" font-family="Arial" font-size="15.00" fill="#d4d4d4">Claude Code, OpenAI GPT, or other AI coding</text>
<text xml:space="preserve" text-anchor="start" x="164.81" y="-62.5" font-family="Arial" font-size="15.00" fill="#d4d4d4">assistants</text>
</g>
<!-- gitrepo -->
<g id="node13" class="node">
<title>gitrepo</title>
<polygon fill="#737373" stroke="#525252" stroke-width="0" points="802.17,-180 482.13,-180 482.13,0 802.17,0 802.17,-180"/>
<text xml:space="preserve" text-anchor="start" x="578.8" y="-104" font-family="Arial" font-size="20.00" fill="#fafafa">Git Repository</text>
<text xml:space="preserve" text-anchor="start" x="512.49" y="-80.5" font-family="Arial" font-size="15.00" fill="#d4d4d4">Version control for generated code and</text>
<text xml:space="preserve" text-anchor="start" x="595.46" y="-62.5" font-family="Arial" font-size="15.00" fill="#d4d4d4">configurations</text>
</g>
<!-- cicd -->
<g id="node14" class="node">
<title>cicd</title>
<polygon fill="#737373" stroke="#525252" stroke-width="0" points="1272.3,-180 912.01,-180 912.01,0 1272.3,0 1272.3,-180"/>
<text xml:space="preserve" text-anchor="start" x="1026.57" y="-95" font-family="Arial" font-size="20.00" fill="#fafafa">CI/CD Pipeline</text>
<text xml:space="preserve" text-anchor="start" x="932.06" y="-71.5" font-family="Arial" font-size="15.00" fill="#d4d4d4">Continuous integration and deployment systems</text>
</g>
<!-- testframework -->
<g id="node15" class="node">
<title>testframework</title>
<polygon fill="#737373" stroke="#525252" stroke-width="0" points="1702.17,-180 1382.13,-180 1382.13,0 1702.17,0 1702.17,-180"/>
<text xml:space="preserve" text-anchor="start" x="1456.58" y="-104" font-family="Arial" font-size="20.00" fill="#fafafa">Testing Framework</text>
<text xml:space="preserve" text-anchor="start" x="1415.42" y="-80.5" font-family="Arial" font-size="15.00" fill="#d4d4d4">TestZeus or other autonomous testing</text>
<text xml:space="preserve" text-anchor="start" x="1511.31" y="-62.5" font-family="Arial" font-size="15.00" fill="#d4d4d4">platforms</text>
</g>
<!-- dashboard&#45;&gt;orchestrationengine -->
<g id="edge6" class="edge">
<title>dashboard&#45;&gt;orchestrationengine</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M855.15,-1308.07C855.15,-1266.87 855.15,-1217.76 855.15,-1175.37"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="857.78,-1175.56 855.15,-1168.06 852.53,-1175.56 857.78,-1175.56"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="855.15,-1225.2 855.15,-1248 1050.25,-1248 1050.25,-1225.2 855.15,-1225.2"/>
<text xml:space="preserve" text-anchor="start" x="858.15" y="-1232.4" font-family="Arial" font-size="14.00" fill="#c9c9c9">Sends workflow configurations</text>
</g>
<!-- orchestrationengine&#45;&gt;contextmanager -->
<g id="edge8" class="edge">
<title>orchestrationengine&#45;&gt;contextmanager</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M997.23,-985.32C1026.13,-966.14 1055.98,-945.51 1083.15,-925.2 1114.72,-901.61 1147.76,-874.58 1177.76,-849.06"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1179.43,-851.09 1183.43,-844.23 1176.02,-847.1 1179.43,-851.09"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1111.75,-902.4 1111.75,-925.2 1285.83,-925.2 1285.83,-902.4 1111.75,-902.4"/>
<text xml:space="preserve" text-anchor="start" x="1114.75" y="-909.6" font-family="Arial" font-size="14.00" fill="#c9c9c9">Accesses business context</text>
</g>
<!-- orchestrationengine&#45;&gt;datastore -->
<g id="edge9" class="edge">
<title>orchestrationengine&#45;&gt;datastore</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M836.91,-985.22C833.31,-958.64 831.18,-929.39 833.16,-902.4 834.35,-886.2 836.26,-869.09 838.46,-852.47"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="841.04,-852.98 839.46,-845.19 835.84,-852.27 841.04,-852.98"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="833.16,-902.4 833.16,-925.2 1060.15,-925.2 1060.15,-902.4 833.16,-902.4"/>
<text xml:space="preserve" text-anchor="start" x="836.16" y="-909.6" font-family="Arial" font-size="14.00" fill="#c9c9c9">Persists configurations and artifacts</text>
</g>
<!-- orchestrationengine&#45;&gt;airuntime -->
<g id="edge10" class="edge">
<title>orchestrationengine&#45;&gt;airuntime</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M695.29,-1030.96C601.41,-996.44 490.45,-937.67 434.16,-842.4 393.45,-773.53 394.07,-731.63 434.16,-662.4 490.47,-565.12 600.83,-502.61 696.04,-464.6"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="696.95,-467.06 702.97,-461.88 695.03,-462.18 696.95,-467.06"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="434.16,-741 434.16,-763.8 640.15,-763.8 640.15,-741 434.16,-741"/>
<text xml:space="preserve" text-anchor="start" x="437.16" y="-748.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">Orchestrates AI agent execution</text>
</g>
<!-- orchestrationengine&#45;&gt;monitoring -->
<g id="edge7" class="edge">
<title>orchestrationengine&#45;&gt;monitoring</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1015.14,-1024.61C1103.44,-996.63 1214.82,-960.32 1313.15,-925.2 1403.5,-892.94 1503.16,-854.37 1584.85,-821.96"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1585.4,-824.56 1591.4,-819.36 1583.46,-819.68 1585.4,-824.56"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1373.64,-902.4 1373.64,-925.2 1620.1,-925.2 1620.1,-902.4 1373.64,-902.4"/>
<text xml:space="preserve" text-anchor="start" x="1376.64" y="-909.6" font-family="Arial" font-size="14.00" fill="#c9c9c9">Sends health and performance metrics</text>
</g>
<!-- contextmanager&#45;&gt;airuntime -->
<g id="edge11" class="edge">
<title>contextmanager&#45;&gt;airuntime</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1175.06,-662.48C1116.61,-615.27 1044.74,-557.23 985.15,-509.1"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="987.03,-507.25 979.55,-504.58 983.74,-511.33 987.03,-507.25"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1088.69,-571.2 1088.69,-594 1248.76,-594 1248.76,-571.2 1088.69,-571.2"/>
<text xml:space="preserve" text-anchor="start" x="1091.69" y="-578.4" font-family="Arial" font-size="14.00" fill="#c9c9c9">Provides technical specs</text>
</g>
<!-- contextmanager&#45;&gt;blueprintsystem -->
<g id="edge12" class="edge">
<title>contextmanager&#45;&gt;blueprintsystem</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1393.94,-662.48C1451.69,-615.27 1522.69,-557.23 1581.58,-509.1"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1582.94,-511.37 1587.09,-504.59 1579.62,-507.3 1582.94,-511.37"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1504.04,-562.8 1504.04,-602.4 1704.59,-602.4 1704.59,-562.8 1504.04,-562.8"/>
<text xml:space="preserve" text-anchor="start" x="1507.04" y="-586.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">Retrieves business context and</text>
<text xml:space="preserve" text-anchor="start" x="1507.04" y="-570" font-family="Arial" font-size="14.00" fill="#c9c9c9">requirements</text>
</g>
<!-- airuntime&#45;&gt;aiprovider -->
<g id="edge13" class="edge">
<title>airuntime&#45;&gt;aiprovider</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M706.16,-362.04C630.24,-336.23 539.43,-301.92 461.47,-262.8 417.17,-240.58 371.18,-212.51 330.26,-185.53"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="331.83,-183.43 324.13,-181.47 328.93,-187.8 331.83,-183.43"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="461.47,-240 461.47,-262.8 721.15,-262.8 721.15,-240 461.47,-240"/>
<text xml:space="preserve" text-anchor="start" x="464.47" y="-247.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">Executes AI&#45;powered development tasks</text>
</g>
<!-- airuntime&#45;&gt;gitrepo -->
<g id="edge14" class="edge">
<title>airuntime&#45;&gt;gitrepo</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M804.78,-322.87C775.46,-281.06 740.42,-231.11 710.39,-188.29"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="712.65,-186.94 706.2,-182.31 708.35,-189.96 712.65,-186.94"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="761.4,-240 761.4,-262.8 923.81,-262.8 923.81,-240 761.4,-240"/>
<text xml:space="preserve" text-anchor="start" x="764.4" y="-247.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">Commits generated code</text>
</g>
<!-- airuntime&#45;&gt;cicd -->
<g id="edge15" class="edge">
<title>airuntime&#45;&gt;cicd</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M929.53,-322.87C958.85,-281.06 993.89,-231.11 1023.92,-188.29"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1025.96,-189.96 1028.11,-182.31 1021.66,-186.94 1025.96,-189.96"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="986.4,-240 986.4,-262.8 1154.26,-262.8 1154.26,-240 986.4,-240"/>
<text xml:space="preserve" text-anchor="start" x="989.4" y="-247.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">Triggers automated builds</text>
</g>
<!-- airuntime&#45;&gt;testframework -->
<g id="edge16" class="edge">
<title>airuntime&#45;&gt;testframework</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1028.53,-335.27C1077.55,-312.01 1131.56,-286.37 1181.15,-262.8 1243.77,-233.05 1312.47,-200.36 1372.98,-171.56"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1373.86,-174.05 1379.5,-168.46 1371.6,-169.31 1373.86,-174.05"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1220.32,-240 1220.32,-262.8 1385.08,-262.8 1385.08,-240 1220.32,-240"/>
<text xml:space="preserve" text-anchor="start" x="1223.32" y="-247.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">Runs autonomous testing</text>
</g>
<!-- engineer&#45;&gt;dashboard -->
<g id="edge1" class="edge">
<title>engineer&#45;&gt;dashboard</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M278.06,-1656.89C317.71,-1622.36 365.92,-1584.62 414.17,-1557.2 498.86,-1509.08 600.82,-1471.36 685.36,-1444.84"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="686.04,-1447.38 692.43,-1442.64 684.48,-1442.37 686.04,-1447.38"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="414.17,-1565.6 414.17,-1588.4 655.15,-1588.4 655.15,-1565.6 414.17,-1565.6"/>
<text xml:space="preserve" text-anchor="start" x="417.17" y="-1572.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">Configures and monitors AI workflows</text>
</g>
<!-- teamlead&#45;&gt;dashboard -->
<g id="edge2" class="edge">
<title>teamlead&#45;&gt;dashboard</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M660.37,-1657.27C670.12,-1624.42 683.8,-1587.74 702.25,-1557.2 715.32,-1535.55 731.86,-1514.52 749.2,-1495.23"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="750.97,-1497.18 754.09,-1489.88 747.09,-1493.64 750.97,-1497.18"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="702.25,-1557.2 702.25,-1596.8 933.15,-1596.8 933.15,-1557.2 702.25,-1557.2"/>
<text xml:space="preserve" text-anchor="start" x="705.25" y="-1581.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">Oversees autonomous development</text>
<text xml:space="preserve" text-anchor="start" x="705.25" y="-1564.4" font-family="Arial" font-size="14.00" fill="#c9c9c9">processes</text>
</g>
<!-- architect&#45;&gt;dashboard -->
<g id="edge3" class="edge">
<title>architect&#45;&gt;dashboard</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1017.24,-1657.25C998.16,-1625.59 976.35,-1589.7 956.15,-1557.2 943.95,-1537.55 930.74,-1516.63 918.03,-1496.66"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="920.3,-1495.33 914.05,-1490.42 915.87,-1498.15 920.3,-1495.33"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="978.29,-1557.2 978.29,-1596.8 1229.41,-1596.8 1229.41,-1557.2 978.29,-1557.2"/>
<text xml:space="preserve" text-anchor="start" x="981.29" y="-1581.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">Designs workflow templates and quality</text>
<text xml:space="preserve" text-anchor="start" x="981.29" y="-1564.4" font-family="Arial" font-size="14.00" fill="#c9c9c9">gates</text>
</g>
<!-- devops&#45;&gt;dashboard -->
<g id="edge4" class="edge">
<title>devops&#45;&gt;dashboard</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1398.72,-1657.03C1356.52,-1622.93 1305.84,-1585.44 1256.15,-1557.2 1183.61,-1515.96 1098.2,-1480.64 1024.88,-1453.9"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1025.87,-1451.47 1017.93,-1451.38 1024.08,-1456.4 1025.87,-1451.47"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1313.25,-1557.2 1313.25,-1596.8 1571.42,-1596.8 1571.42,-1557.2 1313.25,-1557.2"/>
<text xml:space="preserve" text-anchor="start" x="1316.25" y="-1581.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">Manages deployment configurations and</text>
<text xml:space="preserve" text-anchor="start" x="1316.25" y="-1564.4" font-family="Arial" font-size="14.00" fill="#c9c9c9">monitoring</text>
</g>
<!-- monitoring&#45;&gt;dashboard -->
<g id="edge5" class="edge">
<title>monitoring&#45;&gt;dashboard</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1709.77,-842.28C1692.75,-870.89 1671.49,-901.34 1647.15,-925.2 1462.83,-1105.91 1196.41,-1246.19 1024.49,-1325.25"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1023.57,-1322.78 1017.85,-1328.29 1025.76,-1327.55 1023.57,-1322.78"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1575.47,-1063.8 1575.47,-1086.6 1736.33,-1086.6 1736.33,-1063.8 1575.47,-1063.8"/>
<text xml:space="preserve" text-anchor="start" x="1578.47" y="-1071" font-family="Arial" font-size="14.00" fill="#c9c9c9">Provides monitoring data</text>
</g>
</g>
</svg>
`;case"containers":return`<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"
 "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<!-- Generated by graphviz version 14.0.4 (0)
 -->
<!-- Pages: 1 -->
<svg width="1944pt" height="1867pt"
 viewBox="0.00 0.00 1944.00 1867.00" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g id="graph0" class="graph" transform="scale(1 1) rotate(0) translate(15.05 1851.85)">
<g id="clust1" class="cluster">
<title>cluster_softwarefactory</title>
<polygon fill="#194b9e" stroke="#1b3d88" points="229.15,-282.8 229.15,-1549.2 1485.15,-1549.2 1485.15,-282.8 229.15,-282.8"/>
<text xml:space="preserve" text-anchor="start" x="237.15" y="-1536.3" font-family="Arial" font-weight="bold" font-size="11.00" fill="#bfdbfe" fill-opacity="0.701961">SOFTWARE FACTORY PLATFORM</text>
</g>
<!-- dashboard -->
<g id="node1" class="node">
<title>dashboard</title>
<polygon fill="#428a4f" stroke="#2d5d39" stroke-width="0" points="1015.17,-1488 695.13,-1488 695.13,-1308 1015.17,-1308 1015.17,-1488"/>
<text xml:space="preserve" text-anchor="start" x="793.46" y="-1412" font-family="Arial" font-size="20.00" fill="#f8fafc">Dashboard UI</text>
<text xml:space="preserve" text-anchor="start" x="723.85" y="-1388.5" font-family="Arial" font-size="15.00" fill="#c2f0c2">React&#45;based web interface for workflow</text>
<text xml:space="preserve" text-anchor="start" x="723.83" y="-1370.5" font-family="Arial" font-size="15.00" fill="#c2f0c2">configuration, monitoring, and oversight</text>
</g>
<!-- orchestrationengine -->
<g id="node2" class="node">
<title>orchestrationengine</title>
<polygon fill="#428a4f" stroke="#2d5d39" stroke-width="0" points="1015.17,-1165.2 695.13,-1165.2 695.13,-985.2 1015.17,-985.2 1015.17,-1165.2"/>
<text xml:space="preserve" text-anchor="start" x="761.21" y="-1089.2" font-family="Arial" font-size="20.00" fill="#f8fafc">Orchestration Engine</text>
<text xml:space="preserve" text-anchor="start" x="723.41" y="-1065.7" font-family="Arial" font-size="15.00" fill="#c2f0c2">Backend service coordinating AI agents</text>
<text xml:space="preserve" text-anchor="start" x="781.36" y="-1047.7" font-family="Arial" font-size="15.00" fill="#c2f0c2">through SDLC phases</text>
</g>
<!-- contextmanager -->
<g id="node3" class="node">
<title>contextmanager</title>
<polygon fill="#428a4f" stroke="#2d5d39" stroke-width="0" points="1445.17,-842.4 1125.13,-842.4 1125.13,-662.4 1445.17,-662.4 1445.17,-842.4"/>
<text xml:space="preserve" text-anchor="start" x="1208.45" y="-766.4" font-family="Arial" font-size="20.00" fill="#f8fafc">Context Manager</text>
<text xml:space="preserve" text-anchor="start" x="1147.6" y="-742.9" font-family="Arial" font-size="15.00" fill="#c2f0c2">Integration layer with Blueprint system for</text>
<text xml:space="preserve" text-anchor="start" x="1229.29" y="-724.9" font-family="Arial" font-size="15.00" fill="#c2f0c2">business context</text>
</g>
<!-- datastore -->
<g id="node4" class="node">
<title>datastore</title>
<polygon fill="#428a4f" stroke="#2d5d39" stroke-width="0" points="1015.17,-842.4 695.13,-842.4 695.13,-662.4 1015.17,-662.4 1015.17,-842.4"/>
<text xml:space="preserve" text-anchor="start" x="807.35" y="-766.4" font-family="Arial" font-size="20.00" fill="#f8fafc">Data Store</text>
<text xml:space="preserve" text-anchor="start" x="746.78" y="-742.9" font-family="Arial" font-size="15.00" fill="#c2f0c2">Persistent storage for workflows,</text>
<text xml:space="preserve" text-anchor="start" x="763.44" y="-724.9" font-family="Arial" font-size="15.00" fill="#c2f0c2">configurations, and artifacts</text>
</g>
<!-- airuntime -->
<g id="node5" class="node">
<title>airuntime</title>
<polygon fill="#428a4f" stroke="#2d5d39" stroke-width="0" points="1028.54,-502.8 705.77,-502.8 705.77,-322.8 1028.54,-322.8 1028.54,-502.8"/>
<text xml:space="preserve" text-anchor="start" x="788.78" y="-426.8" font-family="Arial" font-size="20.00" fill="#f8fafc">AI Agent Runtime</text>
<text xml:space="preserve" text-anchor="start" x="725.83" y="-403.3" font-family="Arial" font-size="15.00" fill="#c2f0c2">Execution environment for AI development</text>
<text xml:space="preserve" text-anchor="start" x="844.64" y="-385.3" font-family="Arial" font-size="15.00" fill="#c2f0c2">agents</text>
</g>
<!-- engineer -->
<g id="node6" class="node">
<title>engineer</title>
<polygon fill="#a35829" stroke="#7e451d" stroke-width="0" points="370.31,-1836.8 0,-1836.8 0,-1656.8 370.31,-1656.8 370.31,-1836.8"/>
<text xml:space="preserve" text-anchor="start" x="145.13" y="-1760.8" font-family="Arial" font-size="20.00" fill="#ffe0c2">Engineer</text>
<text xml:space="preserve" text-anchor="start" x="20.06" y="-1737.3" font-family="Arial" font-size="15.00" fill="#f9b27c">Software engineer overseeing autonomous SDLC</text>
<text xml:space="preserve" text-anchor="start" x="152.23" y="-1719.3" font-family="Arial" font-size="15.00" fill="#f9b27c">workflows</text>
</g>
<!-- teamlead -->
<g id="node7" class="node">
<title>teamlead</title>
<polygon fill="#a35829" stroke="#7e451d" stroke-width="0" points="800.17,-1836.8 480.13,-1836.8 480.13,-1656.8 800.17,-1656.8 800.17,-1836.8"/>
<text xml:space="preserve" text-anchor="start" x="589.57" y="-1760.8" font-family="Arial" font-size="20.00" fill="#ffe0c2">Team Lead</text>
<text xml:space="preserve" text-anchor="start" x="515.07" y="-1737.3" font-family="Arial" font-size="15.00" fill="#f9b27c">Engineering manager configuring and</text>
<text xml:space="preserve" text-anchor="start" x="560.96" y="-1719.3" font-family="Arial" font-size="15.00" fill="#f9b27c">monitoring AI workflows</text>
</g>
<!-- architect -->
<g id="node8" class="node">
<title>architect</title>
<polygon fill="#a35829" stroke="#7e451d" stroke-width="0" points="1230.29,-1836.8 910.02,-1836.8 910.02,-1656.8 1230.29,-1656.8 1230.29,-1836.8"/>
<text xml:space="preserve" text-anchor="start" x="995.14" y="-1760.8" font-family="Arial" font-size="20.00" fill="#ffe0c2">System Architect</text>
<text xml:space="preserve" text-anchor="start" x="930.07" y="-1737.3" font-family="Arial" font-size="15.00" fill="#f9b27c">Technical architect designing autonomous</text>
<text xml:space="preserve" text-anchor="start" x="990.94" y="-1719.3" font-family="Arial" font-size="15.00" fill="#f9b27c">development processes</text>
</g>
<!-- devops -->
<g id="node9" class="node">
<title>devops</title>
<polygon fill="#a35829" stroke="#7e451d" stroke-width="0" points="1660.17,-1836.8 1340.13,-1836.8 1340.13,-1656.8 1660.17,-1656.8 1660.17,-1836.8"/>
<text xml:space="preserve" text-anchor="start" x="1421.22" y="-1751.8" font-family="Arial" font-size="20.00" fill="#ffe0c2">DevOps Engineer</text>
<text xml:space="preserve" text-anchor="start" x="1367.59" y="-1728.3" font-family="Arial" font-size="15.00" fill="#f9b27c">Infrastructure and deployment specialist</text>
</g>
<!-- monitoring -->
<g id="node10" class="node">
<title>monitoring</title>
<polygon fill="#737373" stroke="#525252" stroke-width="0" points="1914.17,-842.4 1594.13,-842.4 1594.13,-662.4 1914.17,-662.4 1914.17,-842.4"/>
<text xml:space="preserve" text-anchor="start" x="1671.35" y="-766.4" font-family="Arial" font-size="20.00" fill="#fafafa">Monitoring System</text>
<text xml:space="preserve" text-anchor="start" x="1621.58" y="-742.9" font-family="Arial" font-size="15.00" fill="#d4d4d4">Application performance monitoring and</text>
<text xml:space="preserve" text-anchor="start" x="1729.56" y="-724.9" font-family="Arial" font-size="15.00" fill="#d4d4d4">alerting</text>
</g>
<!-- blueprintsystem -->
<g id="node11" class="node">
<title>blueprintsystem</title>
<polygon fill="#737373" stroke="#525252" stroke-width="0" points="1871.21,-502.8 1525.1,-502.8 1525.1,-322.8 1871.21,-322.8 1871.21,-502.8"/>
<text xml:space="preserve" text-anchor="start" x="1585.33" y="-426.8" font-family="Arial" font-size="20.00" fill="#fafafa">Blueprint Context System</text>
<text xml:space="preserve" text-anchor="start" x="1545.16" y="-403.3" font-family="Arial" font-size="15.00" fill="#d4d4d4">Structured business context and requirements</text>
<text xml:space="preserve" text-anchor="start" x="1654.38" y="-385.3" font-family="Arial" font-size="15.00" fill="#d4d4d4">management</text>
</g>
<!-- aiprovider -->
<g id="node12" class="node">
<title>aiprovider</title>
<polygon fill="#737373" stroke="#525252" stroke-width="0" points="372.46,-180 23.85,-180 23.85,0 372.46,0 372.46,-180"/>
<text xml:space="preserve" text-anchor="start" x="148.69" y="-104" font-family="Arial" font-size="20.00" fill="#fafafa">AI Provider</text>
<text xml:space="preserve" text-anchor="start" x="43.9" y="-80.5" font-family="Arial" font-size="15.00" fill="#d4d4d4">Claude Code, OpenAI GPT, or other AI coding</text>
<text xml:space="preserve" text-anchor="start" x="164.81" y="-62.5" font-family="Arial" font-size="15.00" fill="#d4d4d4">assistants</text>
</g>
<!-- gitrepo -->
<g id="node13" class="node">
<title>gitrepo</title>
<polygon fill="#737373" stroke="#525252" stroke-width="0" points="802.17,-180 482.13,-180 482.13,0 802.17,0 802.17,-180"/>
<text xml:space="preserve" text-anchor="start" x="578.8" y="-104" font-family="Arial" font-size="20.00" fill="#fafafa">Git Repository</text>
<text xml:space="preserve" text-anchor="start" x="512.49" y="-80.5" font-family="Arial" font-size="15.00" fill="#d4d4d4">Version control for generated code and</text>
<text xml:space="preserve" text-anchor="start" x="595.46" y="-62.5" font-family="Arial" font-size="15.00" fill="#d4d4d4">configurations</text>
</g>
<!-- cicd -->
<g id="node14" class="node">
<title>cicd</title>
<polygon fill="#737373" stroke="#525252" stroke-width="0" points="1272.3,-180 912.01,-180 912.01,0 1272.3,0 1272.3,-180"/>
<text xml:space="preserve" text-anchor="start" x="1026.57" y="-95" font-family="Arial" font-size="20.00" fill="#fafafa">CI/CD Pipeline</text>
<text xml:space="preserve" text-anchor="start" x="932.06" y="-71.5" font-family="Arial" font-size="15.00" fill="#d4d4d4">Continuous integration and deployment systems</text>
</g>
<!-- testframework -->
<g id="node15" class="node">
<title>testframework</title>
<polygon fill="#737373" stroke="#525252" stroke-width="0" points="1702.17,-180 1382.13,-180 1382.13,0 1702.17,0 1702.17,-180"/>
<text xml:space="preserve" text-anchor="start" x="1456.58" y="-104" font-family="Arial" font-size="20.00" fill="#fafafa">Testing Framework</text>
<text xml:space="preserve" text-anchor="start" x="1415.42" y="-80.5" font-family="Arial" font-size="15.00" fill="#d4d4d4">TestZeus or other autonomous testing</text>
<text xml:space="preserve" text-anchor="start" x="1511.31" y="-62.5" font-family="Arial" font-size="15.00" fill="#d4d4d4">platforms</text>
</g>
<!-- dashboard&#45;&gt;orchestrationengine -->
<g id="edge5" class="edge">
<title>dashboard&#45;&gt;orchestrationengine</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M855.15,-1308.07C855.15,-1266.87 855.15,-1217.76 855.15,-1175.37"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="857.78,-1175.56 855.15,-1168.06 852.53,-1175.56 857.78,-1175.56"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="855.15,-1225.2 855.15,-1248 1050.25,-1248 1050.25,-1225.2 855.15,-1225.2"/>
<text xml:space="preserve" text-anchor="start" x="858.15" y="-1232.4" font-family="Arial" font-size="14.00" fill="#c9c9c9">Sends workflow configurations</text>
</g>
<!-- orchestrationengine&#45;&gt;contextmanager -->
<g id="edge6" class="edge">
<title>orchestrationengine&#45;&gt;contextmanager</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M997.23,-985.32C1026.13,-966.14 1055.98,-945.51 1083.15,-925.2 1114.72,-901.61 1147.76,-874.58 1177.76,-849.06"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1179.43,-851.09 1183.43,-844.23 1176.02,-847.1 1179.43,-851.09"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1111.75,-902.4 1111.75,-925.2 1285.83,-925.2 1285.83,-902.4 1111.75,-902.4"/>
<text xml:space="preserve" text-anchor="start" x="1114.75" y="-909.6" font-family="Arial" font-size="14.00" fill="#c9c9c9">Accesses business context</text>
</g>
<!-- orchestrationengine&#45;&gt;datastore -->
<g id="edge7" class="edge">
<title>orchestrationengine&#45;&gt;datastore</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M836.91,-985.22C833.31,-958.64 831.18,-929.39 833.16,-902.4 834.35,-886.2 836.26,-869.09 838.46,-852.47"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="841.04,-852.98 839.46,-845.19 835.84,-852.27 841.04,-852.98"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="833.16,-902.4 833.16,-925.2 1060.15,-925.2 1060.15,-902.4 833.16,-902.4"/>
<text xml:space="preserve" text-anchor="start" x="836.16" y="-909.6" font-family="Arial" font-size="14.00" fill="#c9c9c9">Persists configurations and artifacts</text>
</g>
<!-- orchestrationengine&#45;&gt;airuntime -->
<g id="edge9" class="edge">
<title>orchestrationengine&#45;&gt;airuntime</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M695.29,-1030.96C601.41,-996.44 490.45,-937.67 434.16,-842.4 393.45,-773.53 394.07,-731.63 434.16,-662.4 490.47,-565.12 600.83,-502.61 696.04,-464.6"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="696.95,-467.06 702.97,-461.88 695.03,-462.18 696.95,-467.06"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="434.16,-741 434.16,-763.8 640.15,-763.8 640.15,-741 434.16,-741"/>
<text xml:space="preserve" text-anchor="start" x="437.16" y="-748.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">Orchestrates AI agent execution</text>
</g>
<!-- orchestrationengine&#45;&gt;monitoring -->
<g id="edge8" class="edge">
<title>orchestrationengine&#45;&gt;monitoring</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1015.14,-1024.61C1103.44,-996.63 1214.82,-960.32 1313.15,-925.2 1403.5,-892.94 1503.16,-854.37 1584.85,-821.96"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1585.4,-824.56 1591.4,-819.36 1583.46,-819.68 1585.4,-824.56"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1373.64,-902.4 1373.64,-925.2 1620.1,-925.2 1620.1,-902.4 1373.64,-902.4"/>
<text xml:space="preserve" text-anchor="start" x="1376.64" y="-909.6" font-family="Arial" font-size="14.00" fill="#c9c9c9">Sends health and performance metrics</text>
</g>
<!-- contextmanager&#45;&gt;airuntime -->
<g id="edge10" class="edge">
<title>contextmanager&#45;&gt;airuntime</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1175.06,-662.48C1116.61,-615.27 1044.74,-557.23 985.15,-509.1"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="987.03,-507.25 979.55,-504.58 983.74,-511.33 987.03,-507.25"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1088.69,-571.2 1088.69,-594 1248.76,-594 1248.76,-571.2 1088.69,-571.2"/>
<text xml:space="preserve" text-anchor="start" x="1091.69" y="-578.4" font-family="Arial" font-size="14.00" fill="#c9c9c9">Provides technical specs</text>
</g>
<!-- contextmanager&#45;&gt;blueprintsystem -->
<g id="edge11" class="edge">
<title>contextmanager&#45;&gt;blueprintsystem</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1393.94,-662.48C1451.69,-615.27 1522.69,-557.23 1581.58,-509.1"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1582.94,-511.37 1587.09,-504.59 1579.62,-507.3 1582.94,-511.37"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1504.04,-562.8 1504.04,-602.4 1704.59,-602.4 1704.59,-562.8 1504.04,-562.8"/>
<text xml:space="preserve" text-anchor="start" x="1507.04" y="-586.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">Retrieves business context and</text>
<text xml:space="preserve" text-anchor="start" x="1507.04" y="-570" font-family="Arial" font-size="14.00" fill="#c9c9c9">requirements</text>
</g>
<!-- airuntime&#45;&gt;aiprovider -->
<g id="edge13" class="edge">
<title>airuntime&#45;&gt;aiprovider</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M706.16,-362.04C630.24,-336.23 539.43,-301.92 461.47,-262.8 417.17,-240.58 371.18,-212.51 330.26,-185.53"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="331.83,-183.43 324.13,-181.47 328.93,-187.8 331.83,-183.43"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="461.47,-240 461.47,-262.8 721.15,-262.8 721.15,-240 461.47,-240"/>
<text xml:space="preserve" text-anchor="start" x="464.47" y="-247.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">Executes AI&#45;powered development tasks</text>
</g>
<!-- airuntime&#45;&gt;gitrepo -->
<g id="edge14" class="edge">
<title>airuntime&#45;&gt;gitrepo</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M804.78,-322.87C775.46,-281.06 740.42,-231.11 710.39,-188.29"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="712.65,-186.94 706.2,-182.31 708.35,-189.96 712.65,-186.94"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="761.4,-240 761.4,-262.8 923.81,-262.8 923.81,-240 761.4,-240"/>
<text xml:space="preserve" text-anchor="start" x="764.4" y="-247.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">Commits generated code</text>
</g>
<!-- airuntime&#45;&gt;cicd -->
<g id="edge15" class="edge">
<title>airuntime&#45;&gt;cicd</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M929.53,-322.87C958.85,-281.06 993.89,-231.11 1023.92,-188.29"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1025.96,-189.96 1028.11,-182.31 1021.66,-186.94 1025.96,-189.96"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="986.4,-240 986.4,-262.8 1154.26,-262.8 1154.26,-240 986.4,-240"/>
<text xml:space="preserve" text-anchor="start" x="989.4" y="-247.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">Triggers automated builds</text>
</g>
<!-- airuntime&#45;&gt;testframework -->
<g id="edge16" class="edge">
<title>airuntime&#45;&gt;testframework</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1028.53,-335.27C1077.55,-312.01 1131.56,-286.37 1181.15,-262.8 1243.77,-233.05 1312.47,-200.36 1372.98,-171.56"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1373.86,-174.05 1379.5,-168.46 1371.6,-169.31 1373.86,-174.05"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1220.32,-240 1220.32,-262.8 1385.08,-262.8 1385.08,-240 1220.32,-240"/>
<text xml:space="preserve" text-anchor="start" x="1223.32" y="-247.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">Runs autonomous testing</text>
</g>
<!-- engineer&#45;&gt;dashboard -->
<g id="edge1" class="edge">
<title>engineer&#45;&gt;dashboard</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M278.06,-1656.89C317.71,-1622.36 365.92,-1584.62 414.17,-1557.2 498.86,-1509.08 600.82,-1471.36 685.36,-1444.84"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="686.04,-1447.38 692.43,-1442.64 684.48,-1442.37 686.04,-1447.38"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="414.17,-1565.6 414.17,-1588.4 655.15,-1588.4 655.15,-1565.6 414.17,-1565.6"/>
<text xml:space="preserve" text-anchor="start" x="417.17" y="-1572.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">Configures and monitors AI workflows</text>
</g>
<!-- teamlead&#45;&gt;dashboard -->
<g id="edge2" class="edge">
<title>teamlead&#45;&gt;dashboard</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M660.37,-1657.27C670.12,-1624.42 683.8,-1587.74 702.25,-1557.2 715.32,-1535.55 731.86,-1514.52 749.2,-1495.23"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="750.97,-1497.18 754.09,-1489.88 747.09,-1493.64 750.97,-1497.18"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="702.25,-1557.2 702.25,-1596.8 933.15,-1596.8 933.15,-1557.2 702.25,-1557.2"/>
<text xml:space="preserve" text-anchor="start" x="705.25" y="-1581.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">Oversees autonomous development</text>
<text xml:space="preserve" text-anchor="start" x="705.25" y="-1564.4" font-family="Arial" font-size="14.00" fill="#c9c9c9">processes</text>
</g>
<!-- architect&#45;&gt;dashboard -->
<g id="edge3" class="edge">
<title>architect&#45;&gt;dashboard</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1017.24,-1657.25C998.16,-1625.59 976.35,-1589.7 956.15,-1557.2 943.95,-1537.55 930.74,-1516.63 918.03,-1496.66"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="920.3,-1495.33 914.05,-1490.42 915.87,-1498.15 920.3,-1495.33"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="978.29,-1557.2 978.29,-1596.8 1229.41,-1596.8 1229.41,-1557.2 978.29,-1557.2"/>
<text xml:space="preserve" text-anchor="start" x="981.29" y="-1581.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">Designs workflow templates and quality</text>
<text xml:space="preserve" text-anchor="start" x="981.29" y="-1564.4" font-family="Arial" font-size="14.00" fill="#c9c9c9">gates</text>
</g>
<!-- devops&#45;&gt;dashboard -->
<g id="edge4" class="edge">
<title>devops&#45;&gt;dashboard</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1398.72,-1657.03C1356.52,-1622.93 1305.84,-1585.44 1256.15,-1557.2 1183.61,-1515.96 1098.2,-1480.64 1024.88,-1453.9"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1025.87,-1451.47 1017.93,-1451.38 1024.08,-1456.4 1025.87,-1451.47"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1313.25,-1557.2 1313.25,-1596.8 1571.42,-1596.8 1571.42,-1557.2 1313.25,-1557.2"/>
<text xml:space="preserve" text-anchor="start" x="1316.25" y="-1581.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">Manages deployment configurations and</text>
<text xml:space="preserve" text-anchor="start" x="1316.25" y="-1564.4" font-family="Arial" font-size="14.00" fill="#c9c9c9">monitoring</text>
</g>
<!-- monitoring&#45;&gt;dashboard -->
<g id="edge12" class="edge">
<title>monitoring&#45;&gt;dashboard</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1709.77,-842.28C1692.75,-870.89 1671.49,-901.34 1647.15,-925.2 1462.83,-1105.91 1196.41,-1246.19 1024.49,-1325.25"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1023.57,-1322.78 1017.85,-1328.29 1025.76,-1327.55 1023.57,-1322.78"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1575.47,-1063.8 1575.47,-1086.6 1736.33,-1086.6 1736.33,-1063.8 1575.47,-1063.8"/>
<text xml:space="preserve" text-anchor="start" x="1578.47" y="-1071" font-family="Arial" font-size="14.00" fill="#c9c9c9">Provides monitoring data</text>
</g>
</g>
</svg>
`;case"orchestrationComponents":return`<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"
 "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<!-- Generated by graphviz version 14.0.4 (0)
 -->
<!-- Pages: 1 -->
<svg width="1752pt" height="865pt"
 viewBox="0.00 0.00 1752.00 865.00" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g id="graph0" class="graph" transform="scale(1 1) rotate(0) translate(15.05 849.85)">
<g id="clust1" class="cluster">
<title>cluster_orchestrationengine</title>
<polygon fill="#2c4e32" stroke="#1e3524" points="8,-282.8 8,-564 1714,-564 1714,-282.8 8,-282.8"/>
<text xml:space="preserve" text-anchor="start" x="16" y="-551.1" font-family="Arial" font-weight="bold" font-size="11.00" fill="#c2f0c2" fill-opacity="0.701961">ORCHESTRATION ENGINE</text>
</g>
<!-- workfloworchestrator -->
<g id="node1" class="node">
<title>workfloworchestrator</title>
<polygon fill="#64748b" stroke="#475569" stroke-width="0" points="369.57,-502.8 48.43,-502.8 48.43,-322.8 369.57,-322.8 369.57,-502.8"/>
<text xml:space="preserve" text-anchor="start" x="109.54" y="-426.8" font-family="Arial" font-size="20.00" fill="#f8fafc">Workflow Orchestrator</text>
<text xml:space="preserve" text-anchor="start" x="68.49" y="-403.3" font-family="Arial" font-size="15.00" fill="#cbd5e1">Manages execution flow through planning,</text>
<text xml:space="preserve" text-anchor="start" x="70.58" y="-385.3" font-family="Arial" font-size="15.00" fill="#cbd5e1">development, testing, deployment phases</text>
</g>
<!-- agentcoordinator -->
<g id="node2" class="node">
<title>agentcoordinator</title>
<polygon fill="#64748b" stroke="#475569" stroke-width="0" points="800.02,-502.8 479.98,-502.8 479.98,-322.8 800.02,-322.8 800.02,-502.8"/>
<text xml:space="preserve" text-anchor="start" x="558.84" y="-426.8" font-family="Arial" font-size="20.00" fill="#f8fafc">Agent Coordinator</text>
<text xml:space="preserve" text-anchor="start" x="516.18" y="-403.3" font-family="Arial" font-size="15.00" fill="#cbd5e1">Manages multiple AI agents and their</text>
<text xml:space="preserve" text-anchor="start" x="601.65" y="-385.3" font-family="Arial" font-size="15.00" fill="#cbd5e1">interactions</text>
</g>
<!-- qualitygate -->
<g id="node3" class="node">
<title>qualitygate</title>
<polygon fill="#64748b" stroke="#475569" stroke-width="0" points="1674.02,-502.8 1353.98,-502.8 1353.98,-322.8 1674.02,-322.8 1674.02,-502.8"/>
<text xml:space="preserve" text-anchor="start" x="1458.42" y="-426.8" font-family="Arial" font-size="20.00" fill="#f8fafc">Quality Gate</text>
<text xml:space="preserve" text-anchor="start" x="1387.25" y="-403.3" font-family="Arial" font-size="15.00" fill="#cbd5e1">Automated code review and validation</text>
<text xml:space="preserve" text-anchor="start" x="1474.39" y="-385.3" font-family="Arial" font-size="15.00" fill="#cbd5e1">checkpoints</text>
</g>
<!-- deploymentmanager -->
<g id="node4" class="node">
<title>deploymentmanager</title>
<polygon fill="#64748b" stroke="#475569" stroke-width="0" points="1243.81,-502.8 910.19,-502.8 910.19,-322.8 1243.81,-322.8 1243.81,-502.8"/>
<text xml:space="preserve" text-anchor="start" x="981.39" y="-426.8" font-family="Arial" font-size="20.00" fill="#f8fafc">Deployment Manager</text>
<text xml:space="preserve" text-anchor="start" x="930.24" y="-403.3" font-family="Arial" font-size="15.00" fill="#cbd5e1">Handles automated deployment with feature</text>
<text xml:space="preserve" text-anchor="start" x="1061.16" y="-385.3" font-family="Arial" font-size="15.00" fill="#cbd5e1">flags</text>
</g>
<!-- dashboard -->
<g id="node5" class="node">
<title>dashboard</title>
<polygon fill="#428a4f" stroke="#2d5d39" stroke-width="0" points="584.02,-834.8 263.98,-834.8 263.98,-654.8 584.02,-654.8 584.02,-834.8"/>
<text xml:space="preserve" text-anchor="start" x="362.3" y="-758.8" font-family="Arial" font-size="20.00" fill="#f8fafc">Dashboard UI</text>
<text xml:space="preserve" text-anchor="start" x="292.69" y="-735.3" font-family="Arial" font-size="15.00" fill="#c2f0c2">React&#45;based web interface for workflow</text>
<text xml:space="preserve" text-anchor="start" x="292.67" y="-717.3" font-family="Arial" font-size="15.00" fill="#c2f0c2">configuration, monitoring, and oversight</text>
</g>
<!-- airuntime -->
<g id="node6" class="node">
<title>airuntime</title>
<polygon fill="#428a4f" stroke="#2d5d39" stroke-width="0" points="1456.38,-180 1133.62,-180 1133.62,0 1456.38,0 1456.38,-180"/>
<text xml:space="preserve" text-anchor="start" x="1216.63" y="-104" font-family="Arial" font-size="20.00" fill="#f8fafc">AI Agent Runtime</text>
<text xml:space="preserve" text-anchor="start" x="1153.67" y="-80.5" font-family="Arial" font-size="15.00" fill="#c2f0c2">Execution environment for AI development</text>
<text xml:space="preserve" text-anchor="start" x="1272.48" y="-62.5" font-family="Arial" font-size="15.00" fill="#c2f0c2">agents</text>
</g>
<!-- contextmanager -->
<g id="node7" class="node">
<title>contextmanager</title>
<polygon fill="#428a4f" stroke="#2d5d39" stroke-width="0" points="864.02,-180 543.98,-180 543.98,0 864.02,0 864.02,-180"/>
<text xml:space="preserve" text-anchor="start" x="627.29" y="-104" font-family="Arial" font-size="20.00" fill="#f8fafc">Context Manager</text>
<text xml:space="preserve" text-anchor="start" x="566.44" y="-80.5" font-family="Arial" font-size="15.00" fill="#c2f0c2">Integration layer with Blueprint system for</text>
<text xml:space="preserve" text-anchor="start" x="648.13" y="-62.5" font-family="Arial" font-size="15.00" fill="#c2f0c2">business context</text>
</g>
<!-- workfloworchestrator&#45;&gt;airuntime -->
<g id="edge3" class="edge">
<title>workfloworchestrator&#45;&gt;airuntime</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M342.31,-322.89C368.91,-307.85 397.23,-293.63 425,-282.8 633.94,-201.33 700.09,-228.68 919,-180 985.97,-165.11 1059.45,-147.91 1123.54,-132.62"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1124.12,-135.19 1130.8,-130.89 1122.9,-130.08 1124.12,-135.19"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="554.85,-240 554.85,-262.8 693.15,-262.8 693.15,-240 554.85,-240"/>
<text xml:space="preserve" text-anchor="start" x="557.85" y="-247.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">Initiates development</text>
</g>
<!-- qualitygate&#45;&gt;airuntime -->
<g id="edge4" class="edge">
<title>qualitygate&#45;&gt;airuntime</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1453.29,-322.87C1424.75,-281.06 1390.65,-231.11 1361.42,-188.29"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1363.74,-187.04 1357.35,-182.33 1359.41,-190 1363.74,-187.04"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1411.07,-240 1411.07,-262.8 1512.76,-262.8 1512.76,-240 1411.07,-240"/>
<text xml:space="preserve" text-anchor="start" x="1414.07" y="-247.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">Triggers review</text>
</g>
<!-- deploymentmanager&#45;&gt;airuntime -->
<g id="edge6" class="edge">
<title>deploymentmanager&#45;&gt;airuntime</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1118.06,-323C1132.04,-295.61 1148.6,-265.87 1166.14,-240 1178.12,-222.33 1191.93,-204.41 1205.95,-187.42"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1207.67,-189.45 1210.46,-182.01 1203.64,-186.09 1207.67,-189.45"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1166.14,-240 1166.14,-262.8 1306,-262.8 1306,-240 1166.14,-240"/>
<text xml:space="preserve" text-anchor="start" x="1169.14" y="-247.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">Manages deployment</text>
</g>
<!-- deploymentmanager&#45;&gt;contextmanager -->
<g id="edge5" class="edge">
<title>deploymentmanager&#45;&gt;contextmanager</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M927.01,-282.8C889.69,-250.7 850.34,-216.86 815.26,-186.69"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="816.98,-184.7 809.58,-181.8 813.55,-188.68 816.98,-184.7"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="693.12,-231.36 693.12,-254.16 867.2,-254.16 867.2,-231.36 693.12,-231.36"/>
<text xml:space="preserve" text-anchor="start" x="696.12" y="-238.56" font-family="Arial" font-size="14.00" fill="#c9c9c9">Accesses business context</text>
</g>
<!-- dashboard&#45;&gt;workfloworchestrator -->
<g id="edge1" class="edge">
<title>dashboard&#45;&gt;workfloworchestrator</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M366.1,-654.93C337.18,-610.54 302.13,-556.74 272.48,-511.23"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="274.76,-509.93 268.47,-505.08 270.36,-512.79 274.76,-509.93"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="322.95,-572 322.95,-594.8 349.94,-594.8 349.94,-572 322.95,-572"/>
<text xml:space="preserve" text-anchor="start" x="325.95" y="-580.2" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">[...]</text>
</g>
<!-- dashboard&#45;&gt;agentcoordinator -->
<g id="edge2" class="edge">
<title>dashboard&#45;&gt;agentcoordinator</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M482.17,-654.93C511.22,-610.54 546.44,-556.74 576.23,-511.23"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="578.35,-512.79 580.26,-505.07 573.95,-509.91 578.35,-512.79"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="532,-572 532,-594.8 637.61,-594.8 637.61,-572 532,-572"/>
<text xml:space="preserve" text-anchor="start" x="535" y="-579.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">Monitors agents</text>
</g>
<!-- contextmanager&#45;&gt;airuntime -->
<g id="edge7" class="edge">
<title>contextmanager&#45;&gt;airuntime</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M863.93,-90C944.17,-90 1041.43,-90 1123.25,-90"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1123.13,-92.63 1130.63,-90 1123.13,-87.38 1123.13,-92.63"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="918.78,-93 918.78,-115.8 1078.86,-115.8 1078.86,-93 918.78,-93"/>
<text xml:space="preserve" text-anchor="start" x="921.78" y="-100.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">Provides technical specs</text>
</g>
</g>
</svg>
`;case"aiAgents":return`<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"
 "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<!-- Generated by graphviz version 14.0.4 (0)
 -->
<!-- Pages: 1 -->
<svg width="2394pt" height="843pt"
 viewBox="0.00 0.00 2394.00 843.00" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g id="graph0" class="graph" transform="scale(1 1) rotate(0) translate(15.05 828.05)">
<g id="clust1" class="cluster">
<title>cluster_airuntime</title>
<polygon fill="#2c4e32" stroke="#1e3524" points="8,-261 8,-542.2 1747,-542.2 1747,-261 8,-261"/>
<text xml:space="preserve" text-anchor="start" x="16" y="-529.3" font-family="Arial" font-weight="bold" font-size="11.00" fill="#c2f0c2" fill-opacity="0.701961">AI AGENT RUNTIME</text>
</g>
<!-- testgenerator -->
<g id="node1" class="node">
<title>testgenerator</title>
<polygon fill="#64748b" stroke="#475569" stroke-width="0" points="368.02,-481 47.98,-481 47.98,-301 368.02,-301 368.02,-481"/>
<text xml:space="preserve" text-anchor="start" x="111.84" y="-405" font-family="Arial" font-size="20.00" fill="#f8fafc">Test Generator Agent</text>
<text xml:space="preserve" text-anchor="start" x="71.67" y="-381.5" font-family="Arial" font-size="15.00" fill="#cbd5e1">AI agent that creates comprehensive test</text>
<text xml:space="preserve" text-anchor="start" x="188.41" y="-363.5" font-family="Arial" font-size="15.00" fill="#cbd5e1">suites</text>
</g>
<!-- codegenerator -->
<g id="node2" class="node">
<title>codegenerator</title>
<polygon fill="#64748b" stroke="#475569" stroke-width="0" points="799.98,-481 478.02,-481 478.02,-301 799.98,-301 799.98,-481"/>
<text xml:space="preserve" text-anchor="start" x="538.38" y="-405" font-family="Arial" font-size="20.00" fill="#f8fafc">Code Generator Agent</text>
<text xml:space="preserve" text-anchor="start" x="498.07" y="-381.5" font-family="Arial" font-size="15.00" fill="#cbd5e1">AI agent responsible for autonomous code</text>
<text xml:space="preserve" text-anchor="start" x="551.44" y="-363.5" font-family="Arial" font-size="15.00" fill="#cbd5e1">generation and refactoring</text>
</g>
<!-- revieweragent -->
<g id="node3" class="node">
<title>revieweragent</title>
<polygon fill="#64748b" stroke="#475569" stroke-width="0" points="1241.56,-481 910.44,-481 910.44,-301 1241.56,-301 1241.56,-481"/>
<text xml:space="preserve" text-anchor="start" x="987.62" y="-405" font-family="Arial" font-size="20.00" fill="#f8fafc">Code Review Agent</text>
<text xml:space="preserve" text-anchor="start" x="930.49" y="-381.5" font-family="Arial" font-size="15.00" fill="#cbd5e1">AI agent performing automated code quality</text>
<text xml:space="preserve" text-anchor="start" x="1035.98" y="-363.5" font-family="Arial" font-size="15.00" fill="#cbd5e1">assessment</text>
</g>
<!-- deploymentagent -->
<g id="node4" class="node">
<title>deploymentagent</title>
<polygon fill="#64748b" stroke="#475569" stroke-width="0" points="1706.67,-481 1351.33,-481 1351.33,-301 1706.67,-301 1706.67,-481"/>
<text xml:space="preserve" text-anchor="start" x="1446.73" y="-405" font-family="Arial" font-size="20.00" fill="#f8fafc">Deployment Agent</text>
<text xml:space="preserve" text-anchor="start" x="1371.39" y="-381.5" font-family="Arial" font-size="15.00" fill="#cbd5e1">AI agent managing deployment automation and</text>
<text xml:space="preserve" text-anchor="start" x="1503.16" y="-363.5" font-family="Arial" font-size="15.00" fill="#cbd5e1">rollback</text>
</g>
<!-- orchestrationengine -->
<g id="node5" class="node">
<title>orchestrationengine</title>
<polygon fill="#428a4f" stroke="#2d5d39" stroke-width="0" points="1236.02,-813 915.98,-813 915.98,-633 1236.02,-633 1236.02,-813"/>
<text xml:space="preserve" text-anchor="start" x="982.06" y="-737" font-family="Arial" font-size="20.00" fill="#f8fafc">Orchestration Engine</text>
<text xml:space="preserve" text-anchor="start" x="944.26" y="-713.5" font-family="Arial" font-size="15.00" fill="#c2f0c2">Backend service coordinating AI agents</text>
<text xml:space="preserve" text-anchor="start" x="1002.2" y="-695.5" font-family="Arial" font-size="15.00" fill="#c2f0c2">through SDLC phases</text>
</g>
<!-- aiprovider -->
<g id="node6" class="node">
<title>aiprovider</title>
<polygon fill="#737373" stroke="#525252" stroke-width="0" points="1034.31,-180 685.69,-180 685.69,0 1034.31,0 1034.31,-180"/>
<text xml:space="preserve" text-anchor="start" x="810.54" y="-104" font-family="Arial" font-size="20.00" fill="#fafafa">AI Provider</text>
<text xml:space="preserve" text-anchor="start" x="705.75" y="-80.5" font-family="Arial" font-size="15.00" fill="#d4d4d4">Claude Code, OpenAI GPT, or other AI coding</text>
<text xml:space="preserve" text-anchor="start" x="826.65" y="-62.5" font-family="Arial" font-size="15.00" fill="#d4d4d4">assistants</text>
</g>
<!-- gitrepo -->
<g id="node7" class="node">
<title>gitrepo</title>
<polygon fill="#737373" stroke="#525252" stroke-width="0" points="1464.02,-180 1143.98,-180 1143.98,0 1464.02,0 1464.02,-180"/>
<text xml:space="preserve" text-anchor="start" x="1240.65" y="-104" font-family="Arial" font-size="20.00" fill="#fafafa">Git Repository</text>
<text xml:space="preserve" text-anchor="start" x="1174.33" y="-80.5" font-family="Arial" font-size="15.00" fill="#d4d4d4">Version control for generated code and</text>
<text xml:space="preserve" text-anchor="start" x="1257.3" y="-62.5" font-family="Arial" font-size="15.00" fill="#d4d4d4">configurations</text>
</g>
<!-- cicd -->
<g id="node8" class="node">
<title>cicd</title>
<polygon fill="#737373" stroke="#525252" stroke-width="0" points="1934.15,-180 1573.85,-180 1573.85,0 1934.15,0 1934.15,-180"/>
<text xml:space="preserve" text-anchor="start" x="1688.42" y="-95" font-family="Arial" font-size="20.00" fill="#fafafa">CI/CD Pipeline</text>
<text xml:space="preserve" text-anchor="start" x="1593.91" y="-71.5" font-family="Arial" font-size="15.00" fill="#d4d4d4">Continuous integration and deployment systems</text>
</g>
<!-- testframework -->
<g id="node9" class="node">
<title>testframework</title>
<polygon fill="#737373" stroke="#525252" stroke-width="0" points="2364.02,-180 2043.98,-180 2043.98,0 2364.02,0 2364.02,-180"/>
<text xml:space="preserve" text-anchor="start" x="2118.42" y="-104" font-family="Arial" font-size="20.00" fill="#fafafa">Testing Framework</text>
<text xml:space="preserve" text-anchor="start" x="2077.27" y="-80.5" font-family="Arial" font-size="15.00" fill="#d4d4d4">TestZeus or other autonomous testing</text>
<text xml:space="preserve" text-anchor="start" x="2173.16" y="-62.5" font-family="Arial" font-size="15.00" fill="#d4d4d4">platforms</text>
</g>
<!-- deploymentagent&#45;&gt;aiprovider -->
<g id="edge4" class="edge">
<title>deploymentagent&#45;&gt;aiprovider</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1297,-261C1295.37,-260.24 1162.64,-208.61 1043.9,-162.46"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1045.05,-160.09 1037.11,-159.82 1043.15,-164.98 1045.05,-160.09"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="906.06,-209.83 906.06,-232.63 1165.74,-232.63 1165.74,-209.83 906.06,-209.83"/>
<text xml:space="preserve" text-anchor="start" x="909.06" y="-217.03" font-family="Arial" font-size="14.00" fill="#c9c9c9">Executes AI&#45;powered development tasks</text>
</g>
<!-- deploymentagent&#45;&gt;gitrepo -->
<g id="edge5" class="edge">
<title>deploymentagent&#45;&gt;gitrepo</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1431.93,-261C1413.5,-236.51 1394.51,-211.27 1376.98,-187.98"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1379.26,-186.65 1372.65,-182.23 1375.07,-189.81 1379.26,-186.65"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1238.89,-220.31 1238.89,-243.11 1401.3,-243.11 1401.3,-220.31 1238.89,-220.31"/>
<text xml:space="preserve" text-anchor="start" x="1241.89" y="-227.51" font-family="Arial" font-size="14.00" fill="#c9c9c9">Commits generated code</text>
</g>
<!-- deploymentagent&#45;&gt;cicd -->
<g id="edge6" class="edge">
<title>deploymentagent&#45;&gt;cicd</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1626.07,-261C1644.5,-236.51 1663.49,-211.27 1681.02,-187.98"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1682.93,-189.81 1685.35,-182.23 1678.74,-186.65 1682.93,-189.81"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1488.83,-220.31 1488.83,-243.11 1656.7,-243.11 1656.7,-220.31 1488.83,-220.31"/>
<text xml:space="preserve" text-anchor="start" x="1491.83" y="-227.51" font-family="Arial" font-size="14.00" fill="#c9c9c9">Triggers automated builds</text>
</g>
<!-- deploymentagent&#45;&gt;testframework -->
<g id="edge7" class="edge">
<title>deploymentagent&#45;&gt;testframework</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1747,-293.44C1840.16,-252.17 1947.28,-204.72 2034.38,-166.14"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="2035.42,-168.55 2041.21,-163.11 2033.29,-163.75 2035.42,-168.55"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1731.09,-227.5 1731.09,-250.3 1895.85,-250.3 1895.85,-227.5 1731.09,-227.5"/>
<text xml:space="preserve" text-anchor="start" x="1734.09" y="-234.7" font-family="Arial" font-size="14.00" fill="#c9c9c9">Runs autonomous testing</text>
</g>
<!-- orchestrationengine&#45;&gt;codegenerator -->
<g id="edge1" class="edge">
<title>orchestrationengine&#45;&gt;codegenerator</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M958.32,-633.13C898.44,-587.91 825.62,-532.93 764.65,-486.89"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="766.5,-484.99 758.93,-482.56 763.33,-489.18 766.5,-484.99"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="870.6,-550.2 870.6,-573 1008.91,-573 1008.91,-550.2 870.6,-550.2"/>
<text xml:space="preserve" text-anchor="start" x="873.6" y="-557.4" font-family="Arial" font-size="14.00" fill="#c9c9c9">Initiates development</text>
</g>
<!-- orchestrationengine&#45;&gt;revieweragent -->
<g id="edge2" class="edge">
<title>orchestrationengine&#45;&gt;revieweragent</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1076,-633.13C1076,-589.3 1076,-536.28 1076,-491.14"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1078.63,-491.27 1076,-483.77 1073.38,-491.27 1078.63,-491.27"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1076,-550.2 1076,-573 1177.69,-573 1177.69,-550.2 1076,-550.2"/>
<text xml:space="preserve" text-anchor="start" x="1079" y="-557.4" font-family="Arial" font-size="14.00" fill="#c9c9c9">Triggers review</text>
</g>
<!-- orchestrationengine&#45;&gt;deploymentagent -->
<g id="edge3" class="edge">
<title>orchestrationengine&#45;&gt;deploymentagent</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1197.99,-633.13C1260.06,-587.91 1335.55,-532.93 1398.75,-486.89"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1400.22,-489.06 1404.74,-482.52 1397.13,-484.82 1400.22,-489.06"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1302.5,-550.2 1302.5,-573 1442.36,-573 1442.36,-550.2 1302.5,-550.2"/>
<text xml:space="preserve" text-anchor="start" x="1305.5" y="-557.4" font-family="Arial" font-size="14.00" fill="#c9c9c9">Manages deployment</text>
</g>
</g>
</svg>
`;case"dashboardComponents":return`<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"
 "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<!-- Generated by graphviz version 14.0.4 (0)
 -->
<!-- Pages: 1 -->
<svg width="2393pt" height="843pt"
 viewBox="0.00 0.00 2393.00 843.00" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g id="graph0" class="graph" transform="scale(1 1) rotate(0) translate(15.05 828.05)">
<g id="clust1" class="cluster">
<title>cluster_dashboard</title>
<polygon fill="#2c4e32" stroke="#1e3524" points="649.15,-282.8 649.15,-564 2355.15,-564 2355.15,-282.8 649.15,-282.8"/>
<text xml:space="preserve" text-anchor="start" x="657.15" y="-551.1" font-family="Arial" font-weight="bold" font-size="11.00" fill="#c2f0c2" fill-opacity="0.701961">DASHBOARD UI</text>
</g>
<!-- blueprintviewer -->
<g id="node1" class="node">
<title>blueprintviewer</title>
<polygon fill="#64748b" stroke="#475569" stroke-width="0" points="1020.7,-502.8 689.61,-502.8 689.61,-322.8 1020.7,-322.8 1020.7,-502.8"/>
<text xml:space="preserve" text-anchor="start" x="782.34" y="-426.8" font-family="Arial" font-size="20.00" fill="#f8fafc">Blueprint Viewer</text>
<text xml:space="preserve" text-anchor="start" x="709.67" y="-403.3" font-family="Arial" font-size="15.00" fill="#cbd5e1">Integration with Blueprint system for context</text>
<text xml:space="preserve" text-anchor="start" x="814.3" y="-385.3" font-family="Arial" font-size="15.00" fill="#cbd5e1">visualization</text>
</g>
<!-- workflowdesigner -->
<g id="node2" class="node">
<title>workflowdesigner</title>
<polygon fill="#64748b" stroke="#475569" stroke-width="0" points="1451.17,-502.8 1131.13,-502.8 1131.13,-322.8 1451.17,-322.8 1451.17,-502.8"/>
<text xml:space="preserve" text-anchor="start" x="1207.24" y="-426.8" font-family="Arial" font-size="20.00" fill="#f8fafc">Workflow Designer</text>
<text xml:space="preserve" text-anchor="start" x="1151.91" y="-403.3" font-family="Arial" font-size="15.00" fill="#cbd5e1">No&#45;code visual designer for configuring AI</text>
<text xml:space="preserve" text-anchor="start" x="1237.38" y="-385.3" font-family="Arial" font-size="15.00" fill="#cbd5e1">agent workflows</text>
</g>
<!-- backlogmanager -->
<g id="node3" class="node">
<title>backlogmanager</title>
<polygon fill="#64748b" stroke="#475569" stroke-width="0" points="1885.37,-502.8 1560.94,-502.8 1560.94,-322.8 1885.37,-322.8 1885.37,-502.8"/>
<text xml:space="preserve" text-anchor="start" x="1645.33" y="-426.8" font-family="Arial" font-size="20.00" fill="#f8fafc">Backlog Manager</text>
<text xml:space="preserve" text-anchor="start" x="1581" y="-403.3" font-family="Arial" font-size="15.00" fill="#cbd5e1">Task scheduling and prioritization interface</text>
<text xml:space="preserve" text-anchor="start" x="1680.63" y="-385.3" font-family="Arial" font-size="15.00" fill="#cbd5e1">for AI agents</text>
</g>
<!-- monitoringdashboard -->
<g id="node4" class="node">
<title>monitoringdashboard</title>
<polygon fill="#64748b" stroke="#475569" stroke-width="0" points="2315.17,-502.8 1995.13,-502.8 1995.13,-322.8 2315.17,-322.8 2315.17,-502.8"/>
<text xml:space="preserve" text-anchor="start" x="2056.77" y="-426.8" font-family="Arial" font-size="20.00" fill="#f8fafc">Monitoring Dashboard</text>
<text xml:space="preserve" text-anchor="start" x="2016.76" y="-403.3" font-family="Arial" font-size="15.00" fill="#cbd5e1">Real&#45;time monitoring of AI agent activities</text>
<text xml:space="preserve" text-anchor="start" x="2094.29" y="-385.3" font-family="Arial" font-size="15.00" fill="#cbd5e1">and system health</text>
</g>
<!-- engineer -->
<g id="node5" class="node">
<title>engineer</title>
<polygon fill="#a35829" stroke="#7e451d" stroke-width="0" points="370.31,-813 0,-813 0,-633 370.31,-633 370.31,-813"/>
<text xml:space="preserve" text-anchor="start" x="145.13" y="-737" font-family="Arial" font-size="20.00" fill="#ffe0c2">Engineer</text>
<text xml:space="preserve" text-anchor="start" x="20.06" y="-713.5" font-family="Arial" font-size="15.00" fill="#f9b27c">Software engineer overseeing autonomous SDLC</text>
<text xml:space="preserve" text-anchor="start" x="152.23" y="-695.5" font-family="Arial" font-size="15.00" fill="#f9b27c">workflows</text>
</g>
<!-- teamlead -->
<g id="node6" class="node">
<title>teamlead</title>
<polygon fill="#a35829" stroke="#7e451d" stroke-width="0" points="800.17,-813 480.13,-813 480.13,-633 800.17,-633 800.17,-813"/>
<text xml:space="preserve" text-anchor="start" x="589.57" y="-737" font-family="Arial" font-size="20.00" fill="#ffe0c2">Team Lead</text>
<text xml:space="preserve" text-anchor="start" x="515.07" y="-713.5" font-family="Arial" font-size="15.00" fill="#f9b27c">Engineering manager configuring and</text>
<text xml:space="preserve" text-anchor="start" x="560.96" y="-695.5" font-family="Arial" font-size="15.00" fill="#f9b27c">monitoring AI workflows</text>
</g>
<!-- architect -->
<g id="node7" class="node">
<title>architect</title>
<polygon fill="#a35829" stroke="#7e451d" stroke-width="0" points="1230.29,-813 910.02,-813 910.02,-633 1230.29,-633 1230.29,-813"/>
<text xml:space="preserve" text-anchor="start" x="995.14" y="-737" font-family="Arial" font-size="20.00" fill="#ffe0c2">System Architect</text>
<text xml:space="preserve" text-anchor="start" x="930.07" y="-713.5" font-family="Arial" font-size="15.00" fill="#f9b27c">Technical architect designing autonomous</text>
<text xml:space="preserve" text-anchor="start" x="990.94" y="-695.5" font-family="Arial" font-size="15.00" fill="#f9b27c">development processes</text>
</g>
<!-- devops -->
<g id="node8" class="node">
<title>devops</title>
<polygon fill="#a35829" stroke="#7e451d" stroke-width="0" points="1660.17,-813 1340.13,-813 1340.13,-633 1660.17,-633 1660.17,-813"/>
<text xml:space="preserve" text-anchor="start" x="1421.22" y="-728" font-family="Arial" font-size="20.00" fill="#ffe0c2">DevOps Engineer</text>
<text xml:space="preserve" text-anchor="start" x="1367.59" y="-704.5" font-family="Arial" font-size="15.00" fill="#f9b27c">Infrastructure and deployment specialist</text>
</g>
<!-- orchestrationengine -->
<g id="node9" class="node">
<title>orchestrationengine</title>
<polygon fill="#428a4f" stroke="#2d5d39" stroke-width="0" points="1883.17,-180 1563.13,-180 1563.13,0 1883.17,0 1883.17,-180"/>
<text xml:space="preserve" text-anchor="start" x="1629.21" y="-104" font-family="Arial" font-size="20.00" fill="#f8fafc">Orchestration Engine</text>
<text xml:space="preserve" text-anchor="start" x="1591.41" y="-80.5" font-family="Arial" font-size="15.00" fill="#c2f0c2">Backend service coordinating AI agents</text>
<text xml:space="preserve" text-anchor="start" x="1649.36" y="-62.5" font-family="Arial" font-size="15.00" fill="#c2f0c2">through SDLC phases</text>
</g>
<!-- workflowdesigner&#45;&gt;orchestrationengine -->
<g id="edge5" class="edge">
<title>workflowdesigner&#45;&gt;orchestrationengine</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1410.92,-322.87C1468.27,-280.27 1537.01,-229.23 1595.37,-185.89"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1596.65,-188.21 1601.1,-181.63 1593.52,-184 1596.65,-188.21"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1520.11,-240 1520.11,-262.8 1638.92,-262.8 1638.92,-240 1520.11,-240"/>
<text xml:space="preserve" text-anchor="start" x="1523.11" y="-247.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">Defines workflows</text>
</g>
<!-- backlogmanager&#45;&gt;orchestrationengine -->
<g id="edge6" class="edge">
<title>backlogmanager&#45;&gt;orchestrationengine</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1723.15,-322.87C1723.15,-281.67 1723.15,-232.56 1723.15,-190.17"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1725.78,-190.36 1723.15,-182.86 1720.53,-190.36 1725.78,-190.36"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1723.15,-240 1723.15,-262.8 1831.1,-262.8 1831.1,-240 1723.15,-240"/>
<text xml:space="preserve" text-anchor="start" x="1726.15" y="-247.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">Schedules tasks</text>
</g>
<!-- monitoringdashboard&#45;&gt;orchestrationengine -->
<g id="edge7" class="edge">
<title>monitoringdashboard&#45;&gt;orchestrationengine</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M2035.39,-322.87C1978.04,-280.27 1909.3,-229.23 1850.94,-185.89"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1852.79,-184 1845.21,-181.63 1849.66,-188.21 1852.79,-184"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1952.11,-240 1952.11,-262.8 2057.71,-262.8 2057.71,-240 1952.11,-240"/>
<text xml:space="preserve" text-anchor="start" x="1955.11" y="-247.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">Monitors agents</text>
</g>
<!-- engineer&#45;&gt;blueprintviewer -->
<g id="edge1" class="edge">
<title>engineer&#45;&gt;blueprintviewer</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M370.01,-636.97C453.55,-598.54 552.81,-552.88 639.71,-512.91"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="640.69,-515.34 646.41,-509.82 638.5,-510.57 640.69,-515.34"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="268.56,-572.78 268.56,-595.58 509.55,-595.58 509.55,-572.78 268.56,-572.78"/>
<text xml:space="preserve" text-anchor="start" x="271.56" y="-579.98" font-family="Arial" font-size="14.00" fill="#c9c9c9">Configures and monitors AI workflows</text>
</g>
<!-- teamlead&#45;&gt;blueprintviewer -->
<g id="edge2" class="edge">
<title>teamlead&#45;&gt;blueprintviewer</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M702.05,-633.27C715.37,-614.18 729.83,-593.46 744.37,-572.61"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="746.51,-574.13 748.65,-566.48 742.2,-571.13 746.51,-574.13"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="726.42,-558.74 726.42,-598.34 957.33,-598.34 957.33,-558.74 726.42,-558.74"/>
<text xml:space="preserve" text-anchor="start" x="729.42" y="-582.74" font-family="Arial" font-size="14.00" fill="#c9c9c9">Oversees autonomous development</text>
<text xml:space="preserve" text-anchor="start" x="729.42" y="-565.94" font-family="Arial" font-size="14.00" fill="#c9c9c9">processes</text>
</g>
<!-- architect&#45;&gt;blueprintviewer -->
<g id="edge3" class="edge">
<title>architect&#45;&gt;blueprintviewer</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1008.26,-633.27C994.94,-614.18 980.48,-593.46 965.94,-572.61"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="968.11,-571.13 961.66,-566.48 963.8,-574.13 968.11,-571.13"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="983.89,-558.74 983.89,-598.34 1235,-598.34 1235,-558.74 983.89,-558.74"/>
<text xml:space="preserve" text-anchor="start" x="986.89" y="-582.74" font-family="Arial" font-size="14.00" fill="#c9c9c9">Designs workflow templates and quality</text>
<text xml:space="preserve" text-anchor="start" x="986.89" y="-565.94" font-family="Arial" font-size="14.00" fill="#c9c9c9">gates</text>
</g>
<!-- devops&#45;&gt;blueprintviewer -->
<g id="edge4" class="edge">
<title>devops&#45;&gt;blueprintviewer</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1340.41,-654.35C1321.86,-646.95 1303.14,-639.68 1285.15,-633 1196.68,-600.13 1166.05,-606.71 1085.2,-568.37"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1086.77,-566.22 1078.88,-565.32 1084.49,-570.95 1086.77,-566.22"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1208.24,-569.61 1208.24,-609.21 1466.4,-609.21 1466.4,-569.61 1208.24,-569.61"/>
<text xml:space="preserve" text-anchor="start" x="1211.24" y="-593.61" font-family="Arial" font-size="14.00" fill="#c9c9c9">Manages deployment configurations and</text>
<text xml:space="preserve" text-anchor="start" x="1211.24" y="-576.81" font-family="Arial" font-size="14.00" fill="#c9c9c9">monitoring</text>
</g>
</g>
</svg>
`;case"contextIntegration":return`<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"
 "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<!-- Generated by graphviz version 14.0.4 (0)
 -->
<!-- Pages: 1 -->
<svg width="892pt" height="1110pt"
 viewBox="0.00 0.00 892.00 1110.00" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g id="graph0" class="graph" transform="scale(1 1) rotate(0) translate(15.05 1095.05)">
<g id="clust1" class="cluster">
<title>cluster_contextmanager</title>
<polygon fill="#2c4e32" stroke="#1e3524" points="8,-260 8,-841.2 854,-841.2 854,-260 8,-260"/>
<text xml:space="preserve" text-anchor="start" x="16" y="-828.3" font-family="Arial" font-weight="bold" font-size="11.00" fill="#c2f0c2" fill-opacity="0.701961">CONTEXT MANAGER</text>
</g>
<!-- blueprintintegrator -->
<g id="node1" class="node">
<title>blueprintintegrator</title>
<polygon fill="#64748b" stroke="#475569" stroke-width="0" points="378.12,-780 47.88,-780 47.88,-600 378.12,-600 378.12,-780"/>
<text xml:space="preserve" text-anchor="start" x="127.95" y="-704" font-family="Arial" font-size="20.00" fill="#f8fafc">Blueprint Integrator</text>
<text xml:space="preserve" text-anchor="start" x="67.93" y="-680.5" font-family="Arial" font-size="15.00" fill="#cbd5e1">API client for accessing structured business</text>
<text xml:space="preserve" text-anchor="start" x="128.37" y="-662.5" font-family="Arial" font-size="15.00" fill="#cbd5e1">requirements and context</text>
</g>
<!-- contextcache -->
<g id="node2" class="node">
<title>contextcache</title>
<polygon fill="#64748b" stroke="#475569" stroke-width="0" points="813.65,-780 488.35,-780 488.35,-600 813.65,-600 813.65,-780"/>
<text xml:space="preserve" text-anchor="start" x="584.85" y="-704" font-family="Arial" font-size="20.00" fill="#f8fafc">Context Cache</text>
<text xml:space="preserve" text-anchor="start" x="508.4" y="-680.5" font-family="Arial" font-size="15.00" fill="#cbd5e1">Local caching of blueprint data for AI agent</text>
<text xml:space="preserve" text-anchor="start" x="627.66" y="-662.5" font-family="Arial" font-size="15.00" fill="#cbd5e1">access</text>
</g>
<!-- requirementmapper -->
<g id="node3" class="node">
<title>requirementmapper</title>
<polygon fill="#64748b" stroke="#475569" stroke-width="0" points="373.02,-480 52.98,-480 52.98,-300 373.02,-300 373.02,-480"/>
<text xml:space="preserve" text-anchor="start" x="119.06" y="-404" font-family="Arial" font-size="20.00" fill="#f8fafc">Requirement Mapper</text>
<text xml:space="preserve" text-anchor="start" x="86.27" y="-380.5" font-family="Arial" font-size="15.00" fill="#cbd5e1">Translates business requirements into</text>
<text xml:space="preserve" text-anchor="start" x="136.29" y="-362.5" font-family="Arial" font-size="15.00" fill="#cbd5e1">technical specifications</text>
</g>
<!-- blueprintsystem -->
<g id="node4" class="node">
<title>blueprintsystem</title>
<polygon fill="#737373" stroke="#525252" stroke-width="0" points="386.06,-180 39.94,-180 39.94,0 386.06,0 386.06,-180"/>
<text xml:space="preserve" text-anchor="start" x="100.17" y="-104" font-family="Arial" font-size="20.00" fill="#fafafa">Blueprint Context System</text>
<text xml:space="preserve" text-anchor="start" x="60" y="-80.5" font-family="Arial" font-size="15.00" fill="#d4d4d4">Structured business context and requirements</text>
<text xml:space="preserve" text-anchor="start" x="169.22" y="-62.5" font-family="Arial" font-size="15.00" fill="#d4d4d4">management</text>
</g>
<!-- orchestrationengine -->
<g id="node5" class="node">
<title>orchestrationengine</title>
<polygon fill="#428a4f" stroke="#2d5d39" stroke-width="0" points="373.02,-1080 52.98,-1080 52.98,-900 373.02,-900 373.02,-1080"/>
<text xml:space="preserve" text-anchor="start" x="119.06" y="-1004" font-family="Arial" font-size="20.00" fill="#f8fafc">Orchestration Engine</text>
<text xml:space="preserve" text-anchor="start" x="81.26" y="-980.5" font-family="Arial" font-size="15.00" fill="#c2f0c2">Backend service coordinating AI agents</text>
<text xml:space="preserve" text-anchor="start" x="139.2" y="-962.5" font-family="Arial" font-size="15.00" fill="#c2f0c2">through SDLC phases</text>
</g>
<!-- blueprintintegrator&#45;&gt;requirementmapper -->
<!-- requirementmapper&#45;&gt;blueprintsystem -->
<g id="edge2" class="edge">
<title>requirementmapper&#45;&gt;blueprintsystem</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M213,-260C213,-236.62 213,-212.56 213,-190.19"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="215.63,-190.3 213,-182.8 210.38,-190.3 215.63,-190.3"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="12.45,-219.77 12.45,-259.37 213,-259.37 213,-219.77 12.45,-219.77"/>
<text xml:space="preserve" text-anchor="start" x="15.45" y="-243.77" font-family="Arial" font-size="14.00" fill="#c9c9c9">Retrieves business context and</text>
<text xml:space="preserve" text-anchor="start" x="15.45" y="-226.97" font-family="Arial" font-size="14.00" fill="#c9c9c9">requirements</text>
</g>
<!-- orchestrationengine&#45;&gt;blueprintintegrator -->
<g id="edge3" class="edge">
<title>orchestrationengine&#45;&gt;blueprintintegrator</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M213,-900.4C213,-884.91 213,-868.37 213,-851.64"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="215.63,-851.73 213,-844.23 210.38,-851.73 215.63,-851.73"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="38.92,-871.11 38.92,-893.91 213,-893.91 213,-871.11 38.92,-871.11"/>
<text xml:space="preserve" text-anchor="start" x="41.92" y="-878.31" font-family="Arial" font-size="14.00" fill="#c9c9c9">Accesses business context</text>
</g>
</g>
</svg>
`;default:throw new Error("Unknown viewId: "+e)}}export{t as dotSource,n as svgSource};
