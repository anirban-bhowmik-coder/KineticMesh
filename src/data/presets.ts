import { PresetScenario } from '../types';

export const PRESET_SCENARIOS: PresetScenario[] = [
  {
    id: "SCN-ENERGY-01",
    tag: "ENERGY_ARBITRAGE",
    domain: "Renewable Energy",
    label: "🇪🇸 Iberian Solar PV + BESS Arbitrage",
    query: "Should a commercial distribution warehouse in Valencia invest in on-site solar PV with battery storage under 2024-2026 Iberian electricity market tariffs?",
    context: "High peak-to-trough price spreads on OMIE, Tarifa 6.1TD capacity charges, and local Spanish RD 244/2019 self-consumption regulations."
  },
  {
    id: "SCN-INFRA-02",
    tag: "CLOUD_OPEX",
    domain: "Enterprise Infrastructure",
    label: "☁️ AWS Multi-Region vs Private Colocation",
    query: "Should a mid-market healthcare SaaS company migrate from AWS multi-region to on-premises colocation to reduce infrastructure OpEx in 2025?",
    context: "Balancing hardware depreciation vs HIPAA/HITRUST compliance re-certification overhead and ARM Graviton4 savings plans."
  },
  {
    id: "SCN-AI-03",
    tag: "ENTERPRISE_LLM",
    domain: "AI Architecture",
    label: "🤖 Enterprise LLMs: Self-Hosted vs Frontier API",
    query: "Should a global financial consultancy deploy self-hosted open-source models (Llama 3) or proprietary API endpoints (Gemini 2.5) for sensitive client audit workflows?",
    context: "Evaluating 1M+ token financial disclosure context windows, GPU cluster TCO, Zero Data Retention guarantees, and data residency."
  },
  {
    id: "SCN-SEC-04",
    tag: "ZERO_TRUST",
    domain: "Cybersecurity",
    label: "🛡️ Hardware-Enforced Zero-Trust Microsegmentation",
    query: "Should a multinational fintech platform mandate hardware-based TPM/Secure Enclave attestation for all internal microservices to mitigate supply chain tampering?",
    context: "Evaluating latency overhead vs PCI-DSS 4.0 requirement 6.4.3 and cryptographic attestation against container escape attacks."
  },
  {
    id: "SCN-HEALTH-05",
    tag: "HEALTHCARE_FHIR",
    domain: "Health Systems",
    label: "🏥 Legacy HL7 v2 to Cloud FHIR Migration",
    query: "Should a regional hospital network migrate its legacy on-premise HL7 v2 engine directly to a cloud-managed Google Cloud Healthcare FHIR API store?",
    context: "Assessing real-time transformation pipeline latency, patient EHR downtime windows, and 21st Century Cures Act compliance."
  }
];
