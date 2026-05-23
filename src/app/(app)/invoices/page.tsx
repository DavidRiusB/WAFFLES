import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Alert } from "@/src/components/ui/alert";

import { Textarea } from "@/src/components/ui/textarea";
import { Select } from "@/src/components/ui/select";

export default function Page() {
  return (
    <div>
      Invoices
      <div className="p-6 flex flex-col gap-4">
        <div className="flex gap-2">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
        </div>
        <div className="flex gap-2">
          <Button size="sm">Small primary</Button>
          <Button size="sm" variant="secondary">
            Small secondary
          </Button>
        </div>
        <div className="flex gap-2">
          <Button disabled>Disabled primary</Button>
          <Button variant="secondary" disabled>
            Disabled secondary
          </Button>
        </div>
        <Button fullWidth>Full width</Button>
      </div>
      <div className="p-6 flex flex-col gap-4 max-w-sm">
        <Input placeholder="Default input" />
        <Input placeholder="With value" defaultValue="Some text" />
        <Input placeholder="Disabled" disabled />
        <Input placeholder="Invalid" invalid />
        <Input placeholder="Invalid + value" invalid defaultValue="bad@" />
        <Input type="email" placeholder="email@example.com" />
        <Input type="password" placeholder="Password" defaultValue="secret" />
      </div>
      <div className="p-6 flex flex-col gap-4 max-w-md">
        <Card>
          <h2 className="text-lg font-bold">Default card</h2>
          <p className="text-muted text-sm">
            White surface, alabaster border, rounded-lg, padded.
          </p>
        </Card>

        <Card as="section">
          <h3 className="text-sm text-muted">Section card</h3>
          <p>Same styling, renders as &lt;section&gt; for semantics.</p>
        </Card>

        <Card padded={false}>
          <div className="p-4 border-b border-border">
            <h3 className="text-sm text-muted">Custom internal padding</h3>
          </div>
          <div className="p-4">
            <p>Card has padded=false; inner divs manage their own.</p>
          </div>
        </Card>

        <Card>
          <h3 className="text-sm text-muted mb-2">
            Card containing other primitives
          </h3>
          <div className="flex flex-col gap-3">
            <Input placeholder="An input inside a card" />
            <div className="flex gap-2">
              <Button size="sm">Primary</Button>
              <Button size="sm" variant="ghost">
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      </div>
      <div className="p-6 flex flex-col gap-4 max-w-md">
        <div className="flex flex-wrap gap-2">
          <Badge>Neutral</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="danger">Danger</Badge>
          <Badge variant="accent">Accent</Badge>
        </div>

        {/* Realistic usage — inline with text */}
        <p className="text-base">
          Email: <span className="font-normal">user@example.com</span>{" "}
          <Badge variant="success">Verified</Badge>
        </p>
        <p className="text-base">
          Status: <Badge variant="warning">SCHEDULED</Badge>
        </p>
        <p className="text-base">
          Status: <Badge variant="accent">CONFIRMED</Badge>
        </p>
        <p className="text-base">
          Status: <Badge variant="neutral">COMPLETED</Badge>
        </p>
        <p className="text-base">
          Status: <Badge variant="danger">CANCELLED</Badge>
        </p>
      </div>
      <div className="p-6 flex flex-col gap-4 max-w-md">
        <Alert>
          A neutral informational message. No title, just body content.
        </Alert>

        <Alert variant="info" title="Heads up">
          Info alerts use neutral styling — quiet, doesn't compete with semantic
          alerts.
        </Alert>

        <Alert variant="success" title="Email verified">
          You can now book appointments.
        </Alert>

        <Alert variant="warning" title="Email not verified">
          Verify your email to enable booking. Check your inbox for the
          verification link.
        </Alert>

        <Alert variant="danger" title="Verification failed">
          This link is invalid or expired. Log in and request a new one.
        </Alert>

        {/* One-liner — no title */}
        <Alert variant="danger">Invalid email or password.</Alert>

        {/* Alert containing other primitives — common composition */}
        <Alert variant="warning" title="Wrong email address?">
          <p className="mb-2">
            Fix the typo and we&apos;ll send a fresh verification link.
          </p>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost">
              Change email
            </Button>
            <Button size="sm" variant="ghost">
              Resend
            </Button>
          </div>
        </Alert>
      </div>
      <div className="p-6 flex flex-col gap-4 max-w-md">
        <Select defaultValue="">
          <option value="">Pick one…</option>
          <option value="a">Option A</option>
          <option value="b">Option B</option>
        </Select>

        <Select invalid defaultValue="">
          <option value="">Invalid select</option>
          <option value="a">Option A</option>
        </Select>

        <Select disabled defaultValue="a">
          <option value="a">Disabled</option>
        </Select>

        <Textarea placeholder="Multi-line input…" />

        <Textarea invalid placeholder="Errored textarea" />

        <Textarea disabled defaultValue="Disabled with value" />
      </div>
    </div>
  );
}
