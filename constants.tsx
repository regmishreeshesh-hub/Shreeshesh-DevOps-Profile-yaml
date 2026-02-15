
import { Skill } from './types';

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  githubLink?: string;
  demoLink?: string;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
  color: string;
}

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
    description: 'Streamlining processes with robust scripting and configuration management.',
    items: [
      'Python, Bash, PowerShell for automation',
      'Ansible playbooks for configuration management',
      'API interactions with Python requests and GraphQL',
      'Custom CLI tooling development with Click/Argparse',
      'System health check automation with cron/systemd',
      'Infrastructure automation with Terraform/Pulumi',
      'CI/CD pipeline automation with GitHub Actions/GitLab CI',
      'ChatOps integration with Slack/Teams bots'
    ]
  },
  {
    id: 'containers',
    title: 'CONTAINERIZATION',
    icon: '📦',
    color: 'from-green-500 to-emerald-600',
    description: 'Modern application packaging and management with Docker and container tools.',
    items: [
      'Docker: Writing multi-stage Dockerfiles, Docker Compose',
      'Image optimization & shrinking techniques',
      'Container debugging with dive and strace',
      'Health checks and liveness/readiness probes',
      'Private registry management with Docker Hub/ECR/GitLab',
      'BuildKit for parallel builds and caching',
      'Docker Swarm for small to medium clusters'
    ]
  },
  {
    id: 'orchestration',
    title: 'KUBERNETES',
    icon: '☸️',
    color: 'from-blue-600 to-blue-800',
    description: 'Scalable container orchestration and management with Kubernetes.',
    items: [
      'Pods, Deployments, Services, Ingress, and Volumes',
      'ConfigMaps/Secrets management and external vault integration',
      'Helm charts development & maintenance with linting',
      'Kubernetes Operators and CRDs development',
      'Namespaces, RBAC, Network Policies, and Pod Security Policies',
      'StatefulSets for databases and stateful applications',
      'Calico/Cilium for advanced network policies',
      'NGINX/Traefik Ingress controllers',
      'HPA/VPA/KEDA for autoscaling',
      'Cluster upgrades, version skew management, and disaster recovery'
    ]
  },
  {
    id: 'pipelines',
    title: 'CI/CD & GITOPS',
    icon: '🔄',
    color: 'from-orange-400 to-yellow-600',
    description: 'Automating code delivery from commit to production with GitOps workflows.',
    items: [
      'GitHub Actions, GitLab CI/CD, Bitbucket Pipelines for CI/CD',
      'ArgoCD, Flux v2 for GitOps deployments',
      'Jenkins Pipeline as Code with Groovy',
      'Tekton pipelines for cloud-native CI/CD',
      'Automated testing (unit, integration, e2e) with Playwright/Cypress',
      'Canary deployments with Argo Rollouts',
      'Blue/green deployments and traffic management',
      'Dependency management and vulnerability scanning',
      'Pipeline observability and debugging'
    ]
  },
  {
    id: 'cloud',
    title: 'CLOUD PLATFORMS',
    icon: '☁️',
    color: 'from-cyan-500 to-blue-500',
    description: 'Multi-cloud infrastructure design and operation with AWS, Azure, and GCP.',
    items: [
      'AWS: EC2/EKS, IAM, VPC, S3, Lambda, Route 53, CloudWatch',
      'Azure: AKS, VMs, Storage, Functions, Virtual Networks',
      'GCP: GKE, Compute Engine, Storage, Cloud Functions',
      'OCI, Linode, DigitalOcean for cost-effective solutions',
      'Cost optimization & FinOps with CloudWatch/Azure Monitor',
      'Multi-cloud disaster recovery strategies and replication',
      'Serverless architectures with Lambda/Functions',
      'Cloud security best practices and compliance'
    ]
  },
  {
    id: 'observability',
    title: 'OBSERVABILITY',
    icon: '📊',
    color: 'from-purple-500 to-pink-600',
    description: 'Gaining deep insights into system performance with metrics, logging, and tracing.',
    items: [
      'Prometheus + Grafana dashboards for monitoring',
      'Loki, ELK/PLG stack for centralized logging',
      'TIG stack (Telegraf, InfluxDB, Grafana) for IoT/edge',
      'OpenTelemetry integration for distributed tracing',
      'Jaeger and Zipkin for microservices tracing',
      'SLOs, SLAs, and actionable alerting with Alertmanager',
      'Distributed tracing for debugging complex systems',
      'Error tracking with Sentry and New Relic'
    ]
  },
  {
    id: 'iac',
    title: 'INFRASTRUCTURE AS CODE',
    icon: '🛠️',
    color: 'from-indigo-500 to-purple-600',
    description: 'Provisioning and managing infrastructure with code using Terraform and friends.',
    items: [
      'Terraform / OpenTofu for cloud provisioning',
      'Pulumi (IaC with TypeScript/Python)',
      'Ansible for configuration management',
      'Chef/Puppet for legacy systems',
      'Version control for infrastructure with Git',
      'Atlantis for Terraform pull request automation',
      'Spacelift for Infrastructure as Code management',
      'Reproducible cloud environments with Packer'
    ]
  },
  {
    id: 'devsecops',
    title: 'DEVSECOPS',
    icon: '🔐',
    color: 'from-red-500 to-rose-700',
    description: 'Security shifted left in the development lifecycle with DevSecOps practices.',
    items: [
      'Snyk, Trivy, Aqua for container scanning',
      'SonarQube, Checkmarx, CodeQL for SAST',
      'Checkov, tfsec, Terrascan for IaC Security',
      'Sysdig, Falco, Aqua for runtime security',
      'HashiCorp Vault, SOPS, AWS Secrets Manager',
      'OPA/Gatekeeper, Kyverno for policy enforcement',
      'Container hardening and least privilege',
      'Compliance as Code with CIS benchmarks',
      'Incident response and forensics'
    ]
  }
];

export const PROJECTS: Project[] = [
  {
    id: 'kubernetes-cluster',
    title: 'Highly Available Kubernetes Cluster',
    description: 'Architected and implemented a highly available Kubernetes cluster using kubeadm on AWS EC2 instances.',
    technologies: ['Kubernetes', 'AWS', 'Terraform', 'Calico', 'HAProxy'],
    githubLink: 'https://github.com/shreeshesh/ha-kubernetes-cluster',
    demoLink: 'https://k8s.shreeshesh.com'
  },
  {
    id: 'microservices-demo',
    title: 'Microservices Application Deployment',
    description: 'Built and deployed a multi-language microservices application with CI/CD pipelines and observability.',
    technologies: ['Node.js', 'Python', 'Docker', 'Kubernetes', 'Prometheus', 'Grafana'],
    githubLink: 'https://github.com/shreeshesh/microservices-demo',
    demoLink: 'https://demo.shreeshesh.com'
  },
  {
    id: 'gitops-argocd',
    title: 'GitOps with ArgoCD',
    description: 'Implemented GitOps workflows using ArgoCD for continuous delivery and deployment.',
    technologies: ['ArgoCD', 'Kubernetes', 'GitHub Actions', 'Helm'],
    githubLink: 'https://github.com/shreeshesh/gitops-argocd',
    demoLink: 'https://argocd.shreeshesh.com'
  },
  {
    id: 'monitoring-stack',
    title: 'Enterprise Monitoring Stack',
    description: 'Designed and deployed a comprehensive monitoring stack for infrastructure and applications.',
    technologies: ['Prometheus', 'Grafana', 'Loki', 'Alertmanager', 'Node Exporter'],
    githubLink: 'https://github.com/shreeshesh/monitoring-stack',
    demoLink: 'https://monitoring.shreeshesh.com'
  }
];

export const SOCIAL_LINKS: SocialLink[] = [
  {
    name: 'GitHub',
    url: 'https://github.com/shreeshesh',
    icon: '🐙',
    color: 'from-gray-400 to-gray-600'
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com/in/shreeshesh',
    icon: '💼',
    color: 'from-blue-600 to-blue-800'
  },
  {
    name: 'Twitter',
    url: 'https://twitter.com/shreeshesh',
    icon: '🐦',
    color: 'from-blue-400 to-blue-600'
  },
  {
    name: 'Dev.to',
    url: 'https://dev.to/shreeshesh',
    icon: '💻',
    color: 'from-gray-800 to-gray-900'
  }
];
