import { ArcherContainer, ArcherElement } from "react-archer";

export function ProductFlow() {
  const relationTo = (targetId) => [
    {
      className: "flow-route",
      domAttributes: { "aria-hidden": true },
      sourceAnchor: "bottom",
      targetAnchor: "top",
      targetId,
    },
  ];

  return (
    <ArcherContainer
      className="product-flow"
      endShape={{ arrow: { arrowLength: 8, arrowThickness: 5 } }}
      lineStyle="curve"
      strokeColor="rgba(143, 29, 29, 0.76)"
      strokeDasharray="2,8"
      strokeWidth={1.4}
      svgContainerStyle={{ pointerEvents: "none", zIndex: 2 }}
    >
      <ol className="flow-track">
        <ArcherElement id="flow-stage-1" relations={relationTo("flow-stage-2")}>
          <li className="flow-stage">
            <div className="flow-marker">
              <span className="flow-numeral" aria-hidden="true">
                01
              </span>
              <p className="flow-label">Read the system</p>
            </div>
            <div className="flow-body">
              <p className="flow-narrative">
                Ravenwatch reads your application code and infrastructure configuration together,
                treating both as the source of truth for how a system is really built.
              </p>
              <div className="flow-sources">
                <figure className="flow-artifact flow-code">
                  <figcaption>checkout/service.py</figcaption>
                  <pre>
                    <code>{`@app.post("/orders")
def place_order(req):
    user = load_user(req.user_id)
    charge = billing.charge(
        user.card, req.amount)
    orders.insert(user.id, charge.id)
    receipts.put_json(charge.id, {
        "email": user.email,
        "order_id": charge.id
    })`}</code>
                  </pre>
                </figure>
                <figure className="flow-artifact flow-code">
                  <figcaption>infra/data.tf</figcaption>
                  <pre>
                    <code>{`resource "aws_db_instance" "orders" {
  engine              = "postgres"
  storage_encrypted   = true
  publicly_accessible = false
}
resource "aws_s3_bucket" "receipts" {
  bucket = "acme-receipts"
  tags = {
    DataClass = "customer-record"
  }
}`}</code>
                  </pre>
                </figure>
              </div>
            </div>
          </li>
        </ArcherElement>

        <ArcherElement id="flow-stage-2" relations={relationTo("flow-stage-3")}>
          <li className="flow-stage">
          <div className="flow-marker">
            <span className="flow-numeral" aria-hidden="true">
              02
            </span>
            <p className="flow-label">Map how data moves</p>
          </div>
          <div className="flow-body">
            <p className="flow-narrative">
              From that context it builds an inferred view of how data moves between services, the
              stores that hold it, and the outside systems it reaches.
            </p>
            <figure className="flow-artifact flow-diagram">
              <figcaption>Inferred data-flow view</figcaption>
              <div className="dfd-canvas">
                <div className="dfd-zone">
                  <span className="dfd-zone-label">Trust boundary</span>
                  <div className="dfd-node dfd-app">
                    Checkout API
                    <small>request handler</small>
                  </div>
                  <svg
                    className="dfd-arrow"
                    viewBox="0 0 48 24"
                    fill="none"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path className="dfd-arrow-line" d="M2 12 H40" />
                    <path className="dfd-arrow-head" d="M34 6 L42 12 L34 18" />
                  </svg>
                  <div className="dfd-node dfd-store">
                    Orders DB
                    <small>postgres</small>
                  </div>
                  <div className="dfd-node dfd-store">
                    Receipts
                    <small>object storage</small>
                  </div>
                </div>
                <svg
                  className="dfd-arrow dfd-arrow-crossing"
                  viewBox="0 0 48 24"
                  fill="none"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path className="dfd-arrow-line" d="M2 12 H40" />
                  <path className="dfd-arrow-head" d="M34 6 L42 12 L34 18" />
                </svg>
                <div className="dfd-node dfd-external">
                  Billing API
                  <small>third party</small>
                </div>
              </div>
              <p className="dfd-note">
                Orders and receipt records persist inside the boundary; payment details cross to an
                external service.
              </p>
            </figure>
          </div>
          </li>
        </ArcherElement>

        <ArcherElement id="flow-stage-3" relations={relationTo("flow-stage-4")}>
          <li className="flow-stage">
          <div className="flow-marker">
            <span className="flow-numeral" aria-hidden="true">
              03
            </span>
            <p className="flow-label">Review risk and privacy</p>
          </div>
          <div className="flow-body">
            <p className="flow-narrative">
              It reviews that view for security threats and privacy exposure, classifying sensitive
              data and how long it persists.
            </p>
            <ul className="flow-review">
              <li>
                <span className="review-tag review-stride">STRIDE &middot; Information disclosure</span>
                <p>Payment details cross a trust boundary to the external Billing API.</p>
              </li>
              <li>
                <span className="review-tag review-privacy">Sensitive &middot; PII + payment</span>
                <p>
                  <code>user.email</code> and <code>user.card</code> are classified as personal and
                  financial data.
                </p>
              </li>
              <li>
                <span className="review-tag review-persist">Persistence &middot; no retention limit</span>
                <p>
                  Receipt records containing customer email addresses are stored with no lifecycle
                  or deletion policy.
                </p>
              </li>
            </ul>
          </div>
          </li>
        </ArcherElement>

        <ArcherElement id="flow-stage-4">
          <li className="flow-stage">
          <div className="flow-marker">
            <span className="flow-numeral" aria-hidden="true">
              04
            </span>
            <p className="flow-label">Make findings actionable</p>
          </div>
          <div className="flow-body">
            <p className="flow-narrative">
              Then it returns prioritized findings, each linked to the source evidence and paired
              with a concrete remediation.
            </p>
            <article className="flow-artifact flow-finding">
              <header className="finding-head">
                <span className="finding-priority">Priority &middot; Medium</span>
                <span className="finding-id">RW-014</span>
              </header>
              <h3 className="finding-title">Set a retention boundary for stored receipts</h3>
              <dl className="finding-detail">
                <div>
                  <dt>Evidence</dt>
                  <dd>
                    <code>checkout/service.py:7</code> stores <code>user.email</code>;{" "}
                    <code>infra/data.tf:6</code> defines the bucket without a lifecycle policy.
                  </dd>
                </div>
                <div>
                  <dt>Recommendation</dt>
                  <dd>
                    Retain only required receipt fields, encrypt the bucket, and add an expiry rule
                    aligned with the documented retention period.
                  </dd>
                </div>
              </dl>
            </article>
          </div>
          </li>
        </ArcherElement>
      </ol>
    </ArcherContainer>
  );
}

export default ProductFlow;
