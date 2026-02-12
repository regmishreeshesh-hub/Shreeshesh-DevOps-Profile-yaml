
import { Skill } from './types';

export const SKILLS: Skill[] = [
  {
    id: 'foundations',
    title: 'FOUNDATIONS',
    icon: '🏗️',
    color: 'from-blue-500 to-indigo-600',
    description: 'Core Linux and system administration expertise.',
    items: [
      'Installation: Ubuntu, RHEL/Rocky, Debian, partitioning, GRUB, RAID',
      'Config: Networking (IP, DNS, NTP), storage (LVM, ext4/xfs), systemd, kernel tuning',
      'Users: Account mgmt, sudo, SSH keys, Privileged Access Management (PAM) policies',
      'Packages: apt/dnf, repos, security updates',
      'Security: Firewalls, SELinux/AppArmor, fail2ban, certificates, Lynis',
      'Monitoring: top/htop, iostat, logs (journalctl), alerting',
      'Backup: rsync, tar, restic, test restores',
      'Troubleshooting: Boot issues, strace, SMART checks, OOM (Out of Memory) debugging'
    ]
  },
  {
    id: 'automation',
    title: 'AUTOMATION & SCRIPTING',
    icon: '⚡',
    color: 'from-orange-500 to-red-600',
    description: 'Streamlining processes with robust scripting.',
    items: [
      'Python, Bash',
      'Automate repetitive tasks',
      'API interactions',
      'Custom CLI tooling development',
      'System health check automation'
    ]
  },
  {
    id: 'containers',
    title: 'CONTAINERIZATION',
    icon: '📦',
    color: 'from-green-500 to-emerald-600',
    description: 'Modern application packaging and management.',
    items: [
      'Docker: Writing Dockerfiles, multi-stage builds',
      'docker-compose for multi-service environments',
      'Image optimization & shrinking',
      'Container debugging & health checks',
      'Private & public registries management'
    ]
  },
  {
    id: 'orchestration',
    title: 'KUBERNETES',
    icon: '☸️',
    color: 'from-blue-600 to-blue-800',
    description: 'Scalable container orchestration and management.',
    items: [
      'Pods, Deployments, Services, Ingress',
      'ConfigMaps/Secrets management',
      'Helm charts development & maintenance',
      'Kubernetes Operators',
      'Namespaces, RBAC, StatefulSets',
      'Kubernetes security contexts & pod hardening',
      'Network policies (Calico/Cilium)',
      'Ingress controllers (NGINX, Traefik)',
      'Autoscaling (HPA, VPA, KEDA)',
      'Cluster upgrades & version skew management'
    ]
  },
  {
    id: 'pipelines',
    title: 'CI/CD & GITOPS',
    icon: '🔄',
    color: 'from-orange-400 to-yellow-600',
    description: 'Automating code delivery from commit to production.',
    items: [
      'GitHub Actions, GitLab CI/CD, Bitbucket Pipelines',
      'ArgoCD, Flux for GitOps deployments',
      'Jenkins pipeline development',
      'Pipelines as code (YAML/Groovy)',
      'Automated testing & canary deployments'
    ]
  },
  {
    id: 'cloud',
    title: 'CLOUD PLATFORMS',
    icon: '☁️',
    color: 'from-cyan-500 to-blue-500',
    description: 'Multi-cloud infrastructure design and operation.',
    items: [
      'AWS (EC2/EKS, IAM, VPC, S3, Lambda)',
      'Azure, GCP, OCI expertise',
      'Linode, DigitalOcean for lean stacks',
      'Cost optimization & FinOps',
      'Multi-cloud disaster recovery strategies'
    ]
  },
  {
    id: 'observability',
    title: 'OBSERVABILITY',
    icon: '📊',
    color: 'from-purple-500 to-pink-600',
    description: 'Gaining deep insights into system performance.',
    items: [
      'Prometheus + Grafana dashboards',
      'Loki, ELK/PLG stack for logging',
      'TIG stack (Telegraf, InfluxDB, Grafana)',
      'OpenTelemetry integration',
      'SLOs, SLAs, and actionable alerting'
    ]
  },
  {
    id: 'iac',
    title: 'INFRASTRUCTURE AS CODE',
    icon: '🛠️',
    color: 'from-indigo-500 to-purple-600',
    description: 'Provisioning infrastructure with precision.',
    items: [
      'Terraform / OpenTofu / Terragrunt',
      'Pulumi (IaC with real programming languages)',
      'Ansible / Chef / Puppet for config mgmt',
      'Version control for infrastructure',
      'Reproducible cloud environments'
    ]
  },
  {
    id: 'devsecops',
    title: 'DEVSECOPS',
    icon: '🔐',
    color: 'from-red-500 to-rose-700',
    description: 'Security shifted left in the development lifecycle.',
    items: [
      'Snyk, Trivy, Aqua (Container scanning)',
      'SonarQube, Checkmarx (SAST)',
      'Checkov, tfsec (IaC Security)',
      'Sysdig, Falco (Runtime security)',
      'HashiCorp Vault, SOPS (Secrets management)',
      'OPA/Gatekeeper, Kyverno (Policy enforcement)'
    ]
  }
];
