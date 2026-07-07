"use client"

import { useQueryClient } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import { z } from "zod"

import EmptyCard from "@/components/empty-card"
import ErrorCard from "@/components/error-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import FormModified from "@/components/ui/form-modified"
import { Loader } from "@/components/ui/loader"
import { Typography } from "@/components/ui/typography"
import useApi from "@/hooks/use-api"
import { useFetch } from "@/hooks/use-fetch"
import {
  formatUserQueryDate,
  type ReplyUserQueryPayload,
  USER_QUERIES_API,
  USER_QUERIES_QUERY_KEYS,
  type UserQuery,
} from "@/lib/api/user-queries"
import { cn } from "@/lib/utils"

const replySchema = z.object({
  reply: z
    .string()
    .min(1, "Please enter a reply message.")
    .max(5000, "Reply must be 5000 characters or less."),
})

export default function UserQueryDetailPage() {
  const params = useParams<{ id: string }>()
  const queryClient = useQueryClient()

  const { data, isLoading, isError, error, refetch, isFetching } =
    useFetch<UserQuery>({
      path: USER_QUERIES_API.admin.get(params.id),
      queryKey: USER_QUERIES_QUERY_KEYS.adminDetail(params.id),
    })

  const { onRequest: sendReply, isPending: isSendingReply } =
    useApi<ReplyUserQueryPayload>({
      key: "reply-user-query",
      method: "post",
      showSuccessToast: true,
    })

  if (isLoading) {
    return <Loader variant="full-page" label="Loading query..." />
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-lg py-12">
        <ErrorCard
          error={error}
          onRetry={() => refetch()}
          isLoading={isFetching}
        />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-3xl py-12">
        <EmptyCard
          title="Query not found"
          description="This message may have been removed or the link is invalid."
        />
      </div>
    )
  }

  const queryId = data.id

  function handleReply(values: z.infer<typeof replySchema>) {
    sendReply({
      path: USER_QUERIES_API.admin.reply(queryId),
      data: { reply: values.reply.trim() },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: USER_QUERIES_QUERY_KEYS.adminList,
        })
        queryClient.invalidateQueries({
          queryKey: USER_QUERIES_QUERY_KEYS.adminDetail(queryId),
        })
        refetch()
      },
    })
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Typography as="h1" variant="h3">
            {data.subjectLabel}
          </Typography>
          <Typography variant="muted" className="mt-1">
            Submitted {formatUserQueryDate(data.createdAt)}
          </Typography>
        </div>
        <Badge
          variant="outline"
          className={cn(
            "w-fit rounded-full",
            data.isResolved
              ? "border-primary/30 bg-primary/10 text-primary"
              : "border-amber-500/30 bg-amber-500/10 text-amber-700"
          )}
        >
          {data.isResolved ? "Resolved" : "Open"}
        </Badge>
      </div>

      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle>Contact Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <DetailItem label="Full Name" value={data.fullName} />
            <DetailItem label="Email" value={data.email} />
            <DetailItem label="Subject" value={data.subjectLabel} />
            <DetailItem
              label="Submitted"
              value={formatUserQueryDate(data.createdAt)}
            />
          </div>

          <div className="space-y-2">
            <Typography variant="small" className="font-semibold">
              Message
            </Typography>
            <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
              <Typography variant="small" className="whitespace-pre-wrap">
                {data.message}
              </Typography>
            </div>
          </div>
        </CardContent>
      </Card>

      {data.isResolved && data.reply ? (
        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle>Sent Reply</CardTitle>
            {data.repliedAt ? (
              <Typography variant="muted" className="text-sm">
                Sent {formatUserQueryDate(data.repliedAt)}
              </Typography>
            ) : null}
          </CardHeader>
          <CardContent>
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
              <Typography variant="small" className="whitespace-pre-wrap">
                {data.reply}
              </Typography>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle>Send Reply</CardTitle>
            <Typography variant="muted" className="text-sm">
              Your reply will be emailed to {data.email} and this query will be
              marked as resolved.
            </Typography>
          </CardHeader>
          <CardContent>
            <FormModified
              schema={replySchema}
              defaultValues={{ reply: "" }}
              onSubmit={handleReply}
              fieldsetProps={{ className: "space-y-4" }}
            >
              {({ components: { Textarea } }) => (
                <>
                  <Textarea
                    name="reply"
                    label="Reply"
                    placeholder="Type your response to the user..."
                    className="min-h-40"
                  />
                  <Button type="submit" disabled={isSendingReply}>
                    {isSendingReply ? (
                      <Loader variant="button" color="white" />
                    ) : (
                      "Send Reply"
                    )}
                  </Button>
                </>
              )}
            </FormModified>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/50 bg-background px-4 py-3">
      <Typography variant="muted" className="text-xs">
        {label}
      </Typography>
      <Typography variant="small" className="mt-1 font-medium break-all">
        {value}
      </Typography>
    </div>
  )
}
