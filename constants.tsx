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
    icon: '<img src="/linux.png" alt="Linux" className="w-8 h-8" />',
    color: '',
    description: 'Core Linux and system administration expertise.',
    items: [
      'Installation: Ubuntu, RHEL/Rocky, Debian, Arch Linux, partitioning, GRUB, RAID',
      'Config: Networking (IP, DNS, NTP), storage (LVM, ext4/xfs), systemd, kernel tuning',
      'Users: Account mgmt, sudo, SSH keys, Privileged Access Management (PAM) policies',
      'Packages: apt/dnf, repos, security updates',
      'Security: Firewalls (iptables, nftables, UFW), SELinux/AppArmor, fail2ban, certificates, Lynis',
      'Networking: TCP/IP stack, routing, VLANs, VPNs, load balancing, network troubleshooting',
      'Virtualization: KVM, QEMU, libvirt, VM management, hypervisor configuration',
      'Monitoring: top/htop, iostat, logs (journalctl), alerting',
      'Backup: rsync, tar, restic, test restores',
      'Troubleshooting: Boot issues, strace, SMART checks, OOM (Out of Memory) debugging'
    ]
  },
  {
    id: 'automation',
    title: 'AUTOMATION & SCRIPTING',
    icon: '<img src="/bash.png" alt="automation" className="w-8 h-8" />',
    color: '',
    description: 'Streamlining processes with robust scripting and configuration management.',
    items: [
      'Python, Bash, PowerShell for automation',
      'Ansible playbooks for configuration management',
      'API interactions with Python requests and GraphQL',
      'System health check automation with cron/systemd',
      'CI/CD pipeline automation with GitHub Actions/GitLab CI',
      'ChatOps integration with Slack/Teams bots',
      'Jenkins pipeline design and maintenance for enterprise CI/CD',
      'Docker multi-stage builds, image optimization, and container security',
      'Automated testing integration, quality gates, and artifact management',
      'Deployment strategies: blue/green, canary, rolling updates'
    ]
  },
  {
    id: 'containers',
    title: 'CONTAINERIZATION',
    icon: '<img src="/docker.png" alt="containerization" className="w-8 h-8" />',

    color: '',
    description: 'Modern application packaging and management with Docker and container tools.',
    items: [
      'Docker: Writing multi-stage Dockerfiles, Docker Compose',
      'Image optimization & shrinking techniques',
      'Container debugging with dive and strace',
      'Health checks and liveness/readiness probes',
      'Private registry management with Docker Hub/ECR/GitLab',
      'BuildKit for parallel builds and caching',
      'Docker Swarm for small to medium clusters',
      'Container security best practices and vulnerability scanning',
      'Kubernetes deployment, scaling, observability, and troubleshooting',
      'Helm charts, Ingress controllers, and Operators management',
      'Backup and recovery strategies for Kubernetes workloads (Velero)'
    ]
  },
  {
    id: 'orchestration',
    title: 'KUBERNETES',
    icon: '<img src="/kubernetes.png" alt="kubernetes" className="w-8 h-8" />',
    color: '',
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
    icon: '<img src="/git.png" alt="gitops" className="w-8 h-8" />',
    color: '',
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
    icon: '<img src="/gcp.png" alt="cloud" className="w-8 h-8" />',
    color: '',
    description: 'Multi-cloud infrastructure design and operation with AWS, Azure, and GCP.',
    items: [
      'AWS: EC2/EKS, IAM, VPC, S3, Lambda, Route 53, CloudWatch',
      'Azure: AKS, VMs, Storage, Functions, Virtual Networks',
      'GCP: GKE, Compute Engine, Storage, Cloud Functions',
      'OCI, Linode, DigitalOcean for cost-effective solutions',
      'Cost optimization & FinOps with CloudWatch/Azure Monitor',
      'Multi-cloud disaster recovery strategies and replication',
      'Serverless architectures with Lambda/Functions',
      'Cloud security best practices and compliance',
      'Production environment experience with AWS, GCP, Azure',
      'Terraform IaC: reusable modules, state management, versioning',
      'Multi-environment workflows and infrastructure deployment'
    ]
  },
  {
    id: 'observability',
    title: 'OBSERVABILITY',
    icon: '<img src="/grafana.png" alt="observability" className="w-8 h-8" />',
    color: '',
    description: 'Gaining deep insights into system performance with metrics, logging, and tracing.',
    items: [
      'Prometheus + Grafana dashboards for monitoring',
      'Loki, ELK/PLG stack for centralized logging',
      'TIG stack (Telegraf, InfluxDB, Grafana) for IoT/edge',
      'OpenTelemetry integration for distributed tracing',
      'Jaeger and Zipkin for microservices tracing',
      'SLOs, SLAs, and actionable alerting with Alertmanager',
      'Distributed tracing for debugging complex systems',
      'Error tracking with Sentry and New Relic',
      'Centralized logging: aggregation, retention policies, alert strategies',
      'Wazuh and SIEM solutions for security monitoring and compliance',
      'SLI/SLO monitoring, error budgets, and incident reduction strategies'
    ]
  },
  {
    id: 'iac',
    title: 'INFRASTRUCTURE AS CODE',
    icon: '<img src="/terraform.png" alt="iac" className="w-8 h-8" />',
    color: '',
    description: 'Provisioning and managing infrastructure with code using Terraform and friends.',
    items: [
      'Terraform / OpenTofu for cloud provisioning',
      'Pulumi (IaC with TypeScript/Python)',
      'Ansible for configuration management',
      'Chef/Puppet for legacy systems',
      'Version control for infrastructure with Git',
      'Reproducible cloud environments with Packer'
    ]
  },
  {
    id: 'devsecops',
    title: 'DEVSECOPS',
    icon: '<img src="/snyk.png" alt="devsecops" className="w-8 h-8" />',
    color: '',
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
      'Incident response and forensics',
      'Zero Trust architecture: identity-first access, continuous verification',
      'Secrets Management: Vault, AWS KMS, Azure Key Vault, GCP KMS',
      'SSL/TLS, certificate management, mTLS, secure ingress/egress policies',
      'IAM/RBAC across cloud and Kubernetes environments',
      'Container scanning: Trivy, Aqua, Snyk, Grype in CI/CD pipelines',
      'Policy enforcement: OPA/Gatekeeper, Kyverno for cluster security',
      'Security analysis: SonarQube, OWASP ZAP, Nmap, Burp Suite integration'
    ]
  }
];

export const PROJECTS: Project[] = [
  {
    id: 'kubernetes-cluster',
    title: 'Highly Available Kubernetes Cluster',
    description: 'Architected and implemented a highly available Kubernetes cluster using kubeadm on AWS EC2 instances.',
    technologies: ['Kubernetes', 'AWS', 'Terraform', 'Calico', 'HAProxy'],
    githubLink: 'https://github.com/regmishreeshesh-hub/ha-kubernetes-cluster',
    demoLink: 'https://k8s.shreeshesh.com'
  },
  {
    id: 'microservices-demo',
    title: 'Microservices Application Deployment',
    description: 'Built and deployed a multi-language microservices application with CI/CD pipelines and observability.',
    technologies: ['Node.js', 'Python', 'Docker', 'Kubernetes', 'Prometheus', 'Grafana'],
    githubLink: 'https://github.com/regmishreeshesh-hub/microservices-demo',
    demoLink: 'https://demo.shreeshesh.com'
  },
  {
    id: 'gitops-argocd',
    title: 'GitOps with ArgoCD',
    description: 'Implemented GitOps workflows using ArgoCD for continuous delivery and deployment.',
    technologies: ['ArgoCD', 'Kubernetes', 'GitHub Actions', 'Helm'],
    githubLink: 'https://github.com/regmishreeshesh-hub/gitops-argocd',
    demoLink: 'https://argocd.shreeshesh.com'
  },
  {
    id: 'monitoring-stack',
    title: 'Enterprise Monitoring Stack',
    description: 'Designed and deployed a comprehensive monitoring stack for infrastructure and applications.',
    technologies: ['Prometheus', 'Grafana', 'Loki', 'Alertmanager', 'Node Exporter'],
    githubLink: 'https://github.com/regmishreeshesh-hub/monitoring-stack',
    demoLink: 'https://monitoring.shreeshesh.com'
  }
];

export const SOCIAL_LINKS: SocialLink[] = [
  {
    name: 'GitHub (Personal)',
    url: 'https://github.com/shreesheshregmi',
    icon: '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" /></svg>',
    color: '',
  },
  {
    name: 'GitHub (Hub)',
    url: 'https://github.com/regmishreeshesh-hub',
    icon: '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" /></svg>',
    color: '',
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com/in/shreeshesh-regmi',
    icon: '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>',
    color: '',
  }
];

export const RESUME_LINKS: SocialLink[] = [
  {
    name: 'Resume (DOCX)',
    url: 'https://docs.google.com/document/d/1toJdmql6JRBV0Gj80xhro4LOf-gUGLtl/edit?usp=drive_link&ouid=107834041569382404825&rtpof=true&sd=true',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>',
    color: '',
  },
  {
    name: 'Resume (PDF)',
    url: 'https://drive.google.com/file/d/14KuBd5zaL_I9JNKhd1sSDx5sSrBXeKX0/view?usp=drive_link',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>',
    color: '',
  }
];
