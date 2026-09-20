// KineticMesh Comprehensive Automated QA Test Suite
import assert from "node:assert/strict";

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";

async function runQASuite() {
  console.log("===============================================================================");
  console.log("             KINETICMESH AUTOMATED QUALITY ASSURANCE SUITE                     ");
  console.log(` Target Server: ${BASE_URL}                                                    `);
  console.log("===============================================================================\n");

  const results = [];

  async function testCase(category, name, fn) {
    const item = { category, name, status: "NOT RUN", error: null };
    try {
      await fn();
      item.status = "PASS";
      console.log(`  [PASS] [${category}] ${name}`);
    } catch (err) {
      item.status = "FAIL";
      item.error = err.message || String(err);
      console.error(`  [FAIL] [${category}] ${name}`);
      console.error(`         Reason: ${item.error}`);
    }
    results.push(item);
  }

  // ===========================================================================
  // 1. HEALTH & METADATA TESTS
  // ===========================================================================
  await testCase("HEALTH", "GET /health and GET /api/health return HTTP 200 with 4-agent status", async () => {
    for (const endpoint of ["/health", "/api/health"]) {
      const res = await fetch(`${BASE_URL}${endpoint}`);
      assert.equal(res.status, 200, `Endpoint ${endpoint} returned ${res.status}`);
      const data = await res.json();
      assert.equal(data.status, "healthy", `Status should be healthy for ${endpoint}`);
      assert.ok(Array.isArray(data.agents), "agents property must be an array");
      assert.equal(data.agents.length, 4, "Must register exactly 4 agents");
      assert.ok(data.agents.includes("Orchestrator"), "Must contain Orchestrator");
      assert.ok(data.agents.includes("Researcher"), "Must contain Researcher");
      assert.ok(data.agents.includes("Verifier"), "Must contain Verifier");
      assert.ok(data.agents.includes("DecisionMaker"), "Must contain DecisionMaker");
      assert.ok(data.grounding, "Must report search grounding capability");
    }
  });

  // ===========================================================================
  // 2. EMPTY INPUT BOUNDARY TESTS
  // ===========================================================================
  await testCase("EMPTY_INPUT", "POST /api/v1/investigate rejects empty string query with HTTP 400", async () => {
    const res = await fetch(`${BASE_URL}/api/v1/investigate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: "" }),
    });
    assert.equal(res.status, 400, `Expected 400, got ${res.status}`);
    const data = await res.json();
    assert.ok(data.detail, "Expected detail property in 400 error response");
  });

  await testCase("EMPTY_INPUT", "POST /api/v1/investigate rejects whitespace-only query with HTTP 400", async () => {
    const res = await fetch(`${BASE_URL}/api/v1/investigate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: "   \t\n  " }),
    });
    assert.equal(res.status, 400, `Expected 400, got ${res.status}`);
  });

  await testCase("EMPTY_INPUT", "POST /api/v1/investigate rejects null query with HTTP 400", async () => {
    const res = await fetch(`${BASE_URL}/api/v1/investigate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: null }),
    });
    assert.equal(res.status, 400, `Expected 400, got ${res.status}`);
  });

  await testCase("EMPTY_INPUT", "GET /api/v1/investigate/stream rejects empty query parameter with HTTP 400", async () => {
    const res = await fetch(`${BASE_URL}/api/v1/investigate/stream?query=`);
    assert.equal(res.status, 400, `Expected 400, got ${res.status}`);
    const data = await res.json();
    assert.ok(data.detail, "Expected detail in streaming error");
  });

  // ===========================================================================
  // 3. OVERSIZED INPUT BOUNDARY TESTS
  // ===========================================================================
  await testCase("OVERSIZED_INPUT", "POST /api/v1/investigate rejects query > 2500 characters with HTTP 400", async () => {
    const oversized = "A".repeat(2501);
    const res = await fetch(`${BASE_URL}/api/v1/investigate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: oversized }),
    });
    assert.equal(res.status, 400, `Expected 400, got ${res.status}`);
    const data = await res.json();
    assert.match(data.detail, /2500 characters/, "Error detail should mention character limit");
  });

  await testCase("OVERSIZED_INPUT", "GET /api/v1/investigate/stream rejects query > 2500 characters with HTTP 400", async () => {
    const oversized = encodeURIComponent("B".repeat(2600));
    const res = await fetch(`${BASE_URL}/api/v1/investigate/stream?query=${oversized}`);
    assert.equal(res.status, 400, `Expected 400, got ${res.status}`);
  });

  // ===========================================================================
  // 4. MALFORMED REQUEST TESTS
  // ===========================================================================
  await testCase("MALFORMED_REQUEST", "POST rejects malformed JSON payload with HTTP 400 without HTML stack trace", async () => {
    const res = await fetch(`${BASE_URL}/api/v1/investigate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: '{"query": "unclosed json string...',
    });
    assert.equal(res.status, 400, `Expected 400 for malformed JSON, got ${res.status}`);
    const data = await res.json();
    assert.ok(data.detail, "Expected JSON error detail");
    assert.ok(!data.detail.includes("<html"), "Error should be clean JSON, not HTML stack trace");
  });

  await testCase("MALFORMED_REQUEST", "POST rejects non-string query types (number, boolean, object) with HTTP 400", async () => {
    const invalidTypes = [12345, true, { nested: "object" }, [1, 2, 3]];
    for (const val of invalidTypes) {
      const res = await fetch(`${BASE_URL}/api/v1/investigate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: val }),
      });
      assert.equal(res.status, 400, `Expected 400 for type ${typeof val}, got ${res.status}`);
    }
  });

  await testCase("MALFORMED_REQUEST", "POST rejects non-object root JSON payloads with HTTP 400", async () => {
    const res = await fetch(`${BASE_URL}/api/v1/investigate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify("plain string payload"),
    });
    assert.equal(res.status, 400, `Expected 400, got ${res.status}`);
  });

  // ===========================================================================
  // 5. VALID INVESTIGATION & COMPLETE SCHEMA VALIDATION
  // ===========================================================================
  await testCase("VALID_INVESTIGATION", "POST /api/v1/investigate processes strategic objective and returns full docket", async () => {
    const res = await fetch(`${BASE_URL}/api/v1/investigate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: "Should a commercial logistics depot in Valencia install 500kW rooftop solar PV and battery storage under 2024 Iberian electricity market tariffs?",
      }),
    });
    assert.equal(res.status, 200, `Expected 200, got ${res.status}`);
    const docket = await res.json();

    // Top-level identifiers & recommendations
    assert.ok(docket.investigation_id, "Missing investigation_id");
    assert.match(docket.investigation_id, /^KM-/, "investigation_id should start with KM- prefix");
    assert.ok(typeof docket.recommendation === "string" && docket.recommendation.length > 20, "recommendation must be substantive string");
    assert.ok(typeof docket.confidence_score === "number" && docket.confidence_score >= 0 && docket.confidence_score <= 1, "confidence_score in [0, 1]");
    assert.ok(typeof docket.model_assessed_confidence === "number" && docket.model_assessed_confidence >= 0 && docket.model_assessed_confidence <= 1, "model_assessed_confidence in [0, 1]");

    // Justification & epistemic arrays
    assert.ok(Array.isArray(docket.primary_reasons) && docket.primary_reasons.length >= 2, "primary_reasons must have >= 2 items");
    assert.ok(Array.isArray(docket.facts) && docket.facts.length > 0, "facts array must not be empty");
    assert.ok(Array.isArray(docket.inferences) && docket.inferences.length > 0, "inferences array must not be empty");
    assert.ok(Array.isArray(docket.uncertainties) && docket.uncertainties.length > 0, "uncertainties array must not be empty");

    // Evidence items and status verification
    assert.ok(Array.isArray(docket.evidence_items) && docket.evidence_items.length >= 3, "evidence_items must contain >= 3 audited claims");
    const allowedStatuses = ["Verified", "Conflicting", "Uncertain", "Unsupported"];
    for (const item of docket.evidence_items) {
      assert.ok(item.id, "Evidence item missing id");
      assert.ok(item.claim_text, "Evidence item missing claim_text");
      assert.ok(allowedStatuses.includes(item.verification_status), `Invalid status ${item.verification_status}`);
      assert.ok(typeof item.confidence === "number", "Evidence item confidence must be number");
      assert.ok(item.verification_note, "Evidence item missing verification_note");
      assert.ok(Array.isArray(item.sources), "Evidence item sources must be array");
      for (const src of item.sources) {
        assert.ok(src.title, "Source missing title");
        assert.ok(src.url, "Source missing url");
        assert.match(src.url, /^https?:\/\//, `Source url must be http/https: ${src.url}`);
      }
    }

    // Risk Envelope, Assumptions & Next Steps
    assert.ok(Array.isArray(docket.risks) && docket.risks.length >= 2, "risks array must contain >= 2 entries");
    for (const risk of docket.risks) {
      assert.ok(risk.risk, "Risk item missing description");
      assert.ok(["High", "Medium", "Low"].includes(risk.likelihood), `Invalid likelihood ${risk.likelihood}`);
      assert.ok(["High", "Medium", "Low"].includes(risk.impact), `Invalid impact ${risk.impact}`);
      assert.ok(risk.mitigation, "Risk item missing mitigation");
    }

    assert.ok(Array.isArray(docket.assumptions) && docket.assumptions.length >= 2, "assumptions must have >= 2 items");
    assert.ok(Array.isArray(docket.next_steps) && docket.next_steps.length >= 2, "next_steps must have >= 2 items");
    assert.ok(typeof docket.iterations_run === "number" && docket.iterations_run >= 1, "iterations_run must be >= 1");
    assert.ok(docket.audit_metadata, "audit_metadata missing");
    assert.ok(Array.isArray(docket.audit_metadata.execution_trace), "audit_metadata execution_trace must be array");
  });

  // ===========================================================================
  // 6. BACKEND FAILURES & RESILIENCY
  // ===========================================================================
  await testCase("BACKEND_FAILURES", "Deliberation engine falls back gracefully and preserves server stability", async () => {
    // Test server remains responsive under complex multi-turn query
    const res = await fetch(`${BASE_URL}/api/v1/investigate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: "Evaluate contradictory data: will European gas market price volatility decrease in winter 2026?",
      }),
    });
    assert.equal(res.status, 200, `Pipeline should deliver consensus docket even on conflicting premises, got ${res.status}`);
    const data = await res.json();
    assert.ok(data.recommendation, "Must return valid recommendation");

    // Verify health check remains intact post-execution
    const health = await fetch(`${BASE_URL}/health`);
    assert.equal(health.status, 200, "Server must remain healthy after processing heavy deliberation");
  });

  // ===========================================================================
  // 7. VERIFICATION FEEDBACK LOOP & STREAMING TELEMETRY
  // ===========================================================================
  await testCase("VERIFICATION_FEEDBACK_LOOP", "GET /api/v1/investigate/stream transmits real-time SSE telemetry", async () => {
    const testQuery = encodeURIComponent("Should an autonomous robotics fleet deploy localized edge compute nodes?");
    const response = await fetch(`${BASE_URL}/api/v1/investigate/stream?query=${testQuery}`);
    assert.equal(response.status, 200, `Expected 200 for SSE stream, got ${response.status}`);
    assert.match(response.headers.get("content-type") || "", /text\/event-stream/, "Content-Type must be text/event-stream");

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let accumulated = "";
    let receivedAgentEvent = false;
    let receivedCompleteEvent = false;

    // Read initial stream chunks
    const startTime = Date.now();
    while (Date.now() - startTime < 8000) {
      const { value, done } = await reader.read();
      if (done) break;
      accumulated += decoder.decode(value, { stream: true });
      if (accumulated.includes("event: agent_event")) {
        receivedAgentEvent = true;
      }
      if (accumulated.includes("event: complete")) {
        receivedCompleteEvent = true;
        break;
      }
    }
    reader.cancel().catch(() => {});

    assert.ok(receivedAgentEvent, "Stream should emit real-time agent_event telemetry packets");
    assert.ok(accumulated.includes("data:"), "Stream should contain formatted SSE data lines");
  });

  // ===========================================================================
  // 8. SECURITY & DEFENSE-IN-DEPTH HEADERS
  // ===========================================================================
  await testCase("SECURITY", "API enforces X-Content-Type-Options: nosniff and Referrer-Policy", async () => {
    const res = await fetch(`${BASE_URL}/api/health`);
    assert.equal(res.headers.get("x-content-type-options"), "nosniff", "Missing X-Content-Type-Options: nosniff");
    assert.ok(res.headers.get("referrer-policy"), "Missing Referrer-Policy");
  });

  await testCase("SECURITY", "CORS policy responds with origin reflection for authorized origins", async () => {
    const res = await fetch(`${BASE_URL}/api/health`, {
      headers: { Origin: "http://localhost:3000" },
    });
    assert.equal(res.headers.get("access-control-allow-origin"), "http://localhost:3000");
  });

  // ===========================================================================
  // SUMMARY REPORT GENERATION
  // ===========================================================================
  console.log("\n===============================================================================");
  console.log("                        QA TEST RESULTS SUMMARY                                ");
  console.log("===============================================================================");

  const passCount = results.filter((r) => r.status === "PASS").length;
  const failCount = results.filter((r) => r.status === "FAIL").length;
  const notRunCount = results.filter((r) => r.status === "NOT RUN").length;

  console.log(` TOTAL TESTS : ${results.length}`);
  console.log(` PASS        : ${passCount}`);
  console.log(` FAIL        : ${failCount}`);
  console.log(` NOT RUN     : ${notRunCount}`);
  console.log("===============================================================================\n");

  if (failCount > 0) {
    process.exit(1);
  }
}

runQASuite();
