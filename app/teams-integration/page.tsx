"use client"

import { useState } from "react"
import { MessageSquare, Send } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"

export default function TeamsIntegrationPage() {
  const [webhookUrl, setWebhookUrl] = useState("")
  const [message, setMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const { toast } = useToast()

  const handleSendMessage = async () => {
    if (!webhookUrl || !message) {
      toast({
        title: "Error",
        description: "Please fill in both webhook URL and message",
        variant: "destructive",
      })
      return
    }

    setIsSending(true)

    // Simulate sending message
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsSending(false)

    toast({
      title: "Message Simulated",
      description: "This would send the message to Microsoft Teams via backend.",
    })

    // Clear form
    setMessage("")
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Teams Integration</h2>
        <p className="mt-2 text-muted-foreground">Send notifications to Microsoft Teams</p>
      </div>

      <Alert className="border-primary/50 bg-primary/5">
        <MessageSquare className="h-4 w-4 text-primary" />
        <AlertDescription>
          <span className="font-semibold text-foreground">For Interview Candidates:</span>
          <span className="text-muted-foreground">
            {" "}
            You will implement the backend endpoint that actually sends this message to Microsoft Teams using the
            webhook URL. The frontend is already prepared to call your API.
          </span>
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Send Test Message</CardTitle>
          <CardDescription>Configure Teams webhook and send a test notification</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="webhook-url">Teams Webhook URL</Label>
            <Input
              id="webhook-url"
              type="url"
              placeholder="https://outlook.office.com/webhook/..."
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Get this URL from Microsoft Teams connector settings</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Enter your message to send to Teams..."
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">This message will be sent as a Teams notification</p>
          </div>

          <Button
            onClick={handleSendMessage}
            disabled={isSending || !webhookUrl || !message}
            className="gap-2"
            size="lg"
          >
            <Send className="h-4 w-4" />
            {isSending ? "Sending..." : "Send Test Message to Teams"}
          </Button>

          <Alert className="border-muted">
            <AlertDescription className="text-sm">
              <strong className="font-semibold text-foreground">Backend Implementation Task:</strong>
              <div className="mt-2 space-y-2 text-muted-foreground">
                <p>
                  Candidates should create an API endpoint (e.g.,{" "}
                  <code className="rounded bg-muted px-1 py-0.5 text-foreground">/api/teams/send</code>) that:
                </p>
                <ol className="ml-4 list-decimal space-y-1">
                  <li>Accepts the webhook URL and message as parameters</li>
                  <li>Validates the webhook URL format</li>
                  <li>Makes a POST request to the Teams webhook with proper formatting</li>
                  <li>Returns success/error status to the frontend</li>
                  <li>Handles errors gracefully with appropriate error messages</li>
                </ol>
              </div>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Example Teams Message Format</CardTitle>
          <CardDescription>Reference for implementing the Teams API call</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="rounded-lg bg-muted p-4 text-xs overflow-x-auto">
            <code>{`{
  "@type": "MessageCard",
  "@context": "http://schema.org/extensions",
  "summary": "i-eSchool Notification",
  "themeColor": "5B7FFF",
  "title": "i-eSchool Admin Panel",
  "text": "Your message content here..."
}`}</code>
          </pre>
        </CardContent>
      </Card>
    </div>
  )
}
