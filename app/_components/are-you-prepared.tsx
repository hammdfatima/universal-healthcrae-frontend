"use client"

import {
  Building2,
  CheckCircle2,
  ClipboardList,
  GraduationCap,
  HeartHandshake,
  PawPrint,
  ShieldCheck,
  Users,
} from "lucide-react"
import type { Route } from "next"
import Link from "next/link"
import { useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Typography } from "@/components/ui/typography"
import { cn } from "@/lib/utils"

type Answer = "yes" | "no" | null

type Question = {
  id: string
  prompt: string
  category: "family" | "pet"
}

const familyQuestions: Question[] = [
  {
    id: "family-meds",
    prompt: "Can you quickly access your family's medication list?",
    category: "family",
  },
  {
    id: "family-allergies",
    prompt:
      "Do you have a current list of allergies for everyone you care for?",
    category: "family",
  },
  {
    id: "family-contacts",
    prompt: "Is emergency contact information ready to share with caregivers?",
    category: "family",
  },
  {
    id: "family-history",
    prompt:
      "Could a doctor quickly access your loved one's medical history in an emergency?",
    category: "family",
  },
]

const petQuestions: Question[] = [
  {
    id: "pet-vaccines",
    prompt: "Can you quickly access your pet's vaccination records?",
    category: "pet",
  },
  {
    id: "pet-meds",
    prompt: "Do you have a list of your pet's medications?",
    category: "pet",
  },
  {
    id: "pet-vet",
    prompt: "Is your veterinarian's contact information readily available?",
    category: "pet",
  },
  {
    id: "pet-microchip",
    prompt: "Do you know your pet's microchip number?",
    category: "pet",
  },
  {
    id: "pet-history",
    prompt:
      "Could an emergency veterinarian quickly access your pet's medical history?",
    category: "pet",
  },
]

const scenarios = [
  {
    icon: Building2,
    question: "Mom needs care suddenly?",
    detail:
      "Could you immediately share her medications and allergies—or would everyone be searching through old paperwork?",
    image: "/preparedness1.jpg",
    alt: "Family member organizing important documents at home",
  },
  {
    icon: HeartHandshake,
    question: "Your spouse can't communicate?",
    detail:
      "In a crisis, caregivers need accurate health details ready—not guesses under pressure.",
    image: "/preparedness4.jpg",
    alt: "Family preparing important information together at home",
  },
  {
    icon: GraduationCap,
    question: "Your child is away at college?",
    detail:
      "Make sure their medical history is available even when you're hundreds of miles away.",
    image: "/preparedness3.jpg",
    alt: "Parent connecting with children over a video call",
  },
  {
    icon: PawPrint,
    question: "Your pet needs urgent care?",
    detail:
      "Vets need vaccinations, medications, and allergies fast—not a scramble through old folders.",
    image: "/pet1.jpg",
    alt: "Family dog outdoors",
  },
] as const

function scoreLabel(percent: number) {
  if (percent >= 80) return "Well prepared"
  if (percent >= 50) return "Partially prepared"
  return "Needs attention"
}

function ScoreMeter({
  label,
  percent,
  icon: Icon,
  accentClass,
}: {
  label: string
  percent: number
  icon: typeof PawPrint
  accentClass: string
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-background p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon className="size-5" aria-hidden />
          </span>
          <div>
            <Typography variant="small" color="muted">
              {label}
            </Typography>
            <Typography as="p" variant="h3" className="mt-1 tabular-nums">
              {percent}%
            </Typography>
          </div>
        </div>
        <span className="rounded-full bg-secondary/10 px-2.5 py-1 text-xs font-medium text-secondary">
          {scoreLabel(percent)}
        </span>
      </div>
      <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            accentClass
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}

function ChoiceCard({
  selected,
  onClick,
  icon: Icon,
  title,
  description,
}: {
  selected?: boolean
  onClick: () => void
  icon: typeof PawPrint
  title: string
  description: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex w-full flex-col items-start gap-3 rounded-2xl border bg-background p-5 text-left shadow-sm transition-all",
        selected
          ? "border-primary ring-2 ring-primary/20"
          : "border-border/70 hover:border-primary/40 hover:shadow-md"
      )}
    >
      <span
        className={cn(
          "flex size-11 items-center justify-center rounded-full transition-colors",
          selected
            ? "bg-primary text-primary-foreground"
            : "bg-primary/10 text-primary group-hover:bg-primary/15"
        )}
      >
        <Icon className="size-5" aria-hidden />
      </span>
      <div>
        <Typography variant="p" className="font-semibold">
          {title}
        </Typography>
        <Typography variant="muted" className="mt-1 text-sm leading-relaxed">
          {description}
        </Typography>
      </div>
    </button>
  )
}

export default function AreYouPrepared() {
  const [ownsPets, setOwnsPets] = useState<boolean | null>(null)
  const [answers, setAnswers] = useState<Record<string, Answer>>({})

  const activeQuestions = useMemo(() => {
    if (ownsPets === null) return []
    return ownsPets ? [...familyQuestions, ...petQuestions] : familyQuestions
  }, [ownsPets])

  const answeredCount = activeQuestions.filter(
    (q) => answers[q.id] != null
  ).length
  const progressPercent =
    activeQuestions.length === 0
      ? 0
      : Math.round((answeredCount / activeQuestions.length) * 100)
  const isComplete =
    ownsPets !== null &&
    activeQuestions.length > 0 &&
    answeredCount === activeQuestions.length

  const familyScore = useMemo(() => {
    const answered = familyQuestions.filter((q) => answers[q.id] != null)
    if (answered.length === 0) return 0
    const yes = answered.filter((q) => answers[q.id] === "yes").length
    return Math.round((yes / answered.length) * 100)
  }, [answers])

  const petScore = useMemo(() => {
    const answered = petQuestions.filter((q) => answers[q.id] != null)
    if (answered.length === 0) return 0
    const yes = answered.filter((q) => answers[q.id] === "yes").length
    return Math.round((yes / answered.length) * 100)
  }, [answers])

  function setAnswer(id: string, value: Answer) {
    setAnswers((prev) => ({ ...prev, [id]: value }))
  }

  function resetAssessment() {
    setOwnsPets(null)
    setAnswers({})
  }

  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <Typography as="h2" variant="h2">
            If an Emergency Happened Tonight, Would Your Family Be Ready?
          </Typography>
          <Typography variant="lead" color="muted" className="mt-4">
            Could they immediately provide your medications, allergies,
            emergency contacts, and essential medical history?
          </Typography>
          <Typography variant="p" color="muted" className="mt-3">
            Universal Health Charts helps you prepare that information now, so
            the people you love aren&apos;t left searching during a crisis.
          </Typography>
        </div>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {scenarios.map(({ icon: Icon, question, detail, image, alt }) => (
            <li key={question} className="min-w-0">
              <Card className="h-full overflow-hidden border-border/80 bg-card py-0 transition-shadow hover:shadow-md">
                <div className="relative aspect-[4/3] w-full shrink-0 bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element -- local public assets; avoid optimizer edge cases with converted JFIF sources */}
                  <img
                    src={image}
                    alt={alt}
                    className="absolute inset-0 size-full object-cover"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-secondary/70 to-transparent"
                  />
                  <span className="absolute bottom-3 left-3 flex size-10 items-center justify-center rounded-full bg-white/95 text-primary shadow-sm">
                    <Icon className="size-5" aria-hidden />
                  </span>
                </div>
                <CardContent className="p-5 pt-5">
                  <Typography
                    as="h3"
                    variant="h4"
                    className="text-base lg:text-lg"
                  >
                    {question}
                  </Typography>
                  <Typography
                    variant="p"
                    color="muted"
                    className="mt-2 text-sm"
                  >
                    {detail}
                  </Typography>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>

        <div className="mx-auto mt-14 max-w-3xl overflow-hidden rounded-3xl border border-primary/15 bg-background shadow-sm">
          <div className="border-b border-primary/10 bg-gradient-to-br from-brand-primary-light/80 via-brand-primary-light/40 to-background px-6 py-8 sm:px-10 sm:py-10">
            <div className="mx-auto flex max-w-xl flex-col items-center text-center">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground shadow-sm">
                <ClipboardList className="size-6" aria-hidden />
              </span>
              <Typography as="h3" variant="h3" className="mt-4">
                Preparedness Assessment
              </Typography>
              <Typography
                variant="muted"
                className="mt-2 text-sm leading-relaxed sm:text-base"
              >
                Answer a few quick questions. If you own pets, we&apos;ll also
                calculate a Pet Preparedness Score.
              </Typography>
            </div>
          </div>

          <div className="px-6 py-8 sm:px-10 sm:py-10">
            {ownsPets === null ? (
              <div>
                <Typography
                  variant="p"
                  className="text-center text-base font-semibold sm:text-lg"
                >
                  Do you own one or more pets?
                </Typography>
                <Typography
                  variant="muted"
                  className="mx-auto mt-2 max-w-md text-center text-sm"
                >
                  This helps us include the right questions for your household.
                </Typography>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <ChoiceCard
                    icon={PawPrint}
                    title="Yes, I have pets"
                    description="We'll add pet questions and calculate a Pet Preparedness Score."
                    onClick={() => setOwnsPets(true)}
                  />
                  <ChoiceCard
                    icon={Users}
                    title="No pets"
                    description="We'll focus on family medical preparedness for your household."
                    onClick={() => setOwnsPets(false)}
                  />
                </div>
              </div>
            ) : !isComplete ? (
              <div className="space-y-5">
                <div className="rounded-2xl border border-border/60 bg-brand-primary-light/30 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Typography variant="small" className="font-medium">
                      {ownsPets
                        ? "Family & pet questions"
                        : "Family preparedness questions"}
                    </Typography>
                    <Typography variant="muted" className="text-xs">
                      {answeredCount} of {activeQuestions.length} answered
                    </Typography>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-background">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {activeQuestions.map((question, index) => {
                  const answered = answers[question.id]

                  return (
                    <div
                      key={question.id}
                      className={cn(
                        "rounded-2xl border bg-background p-4 transition-colors sm:p-5",
                        answered
                          ? "border-primary/30 bg-brand-primary-light/20"
                          : "border-border/70"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        {question.category === "pet" ? (
                          <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <PawPrint className="size-4" aria-hidden />
                          </span>
                        ) : (
                          <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-sm font-semibold text-secondary">
                            {index + 1}
                          </span>
                        )}
                        <div className="min-w-0 flex-1">
                          <Typography
                            variant="p"
                            className="text-sm font-medium sm:text-base"
                          >
                            {question.prompt}
                          </Typography>
                          {question.category === "pet" ? (
                            <Typography
                              variant="muted"
                              className="mt-1 text-xs"
                            >
                              Pet question
                            </Typography>
                          ) : null}
                          <div className="mt-4 flex flex-wrap gap-2">
                            <Button
                              type="button"
                              size="sm"
                              variant={
                                answered === "yes" ? "default" : "outline"
                              }
                              onClick={() => setAnswer(question.id, "yes")}
                            >
                              Yes
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant={
                                answered === "no" ? "default" : "outline"
                              }
                              onClick={() => setAnswer(question.id, "no")}
                            >
                              No
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex flex-col items-center text-center">
                  <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                    <CheckCircle2 className="size-4" aria-hidden />
                    Assessment complete
                  </span>
                  <Typography variant="muted" className="mt-3 max-w-md text-sm">
                    Here&apos;s how prepared your household looks right now.
                  </Typography>
                </div>

                <div
                  className={cn(
                    "grid gap-4",
                    ownsPets ? "sm:grid-cols-2" : "sm:grid-cols-1"
                  )}
                >
                  <ScoreMeter
                    label="Family Preparedness Score"
                    percent={familyScore}
                    icon={ShieldCheck}
                    accentClass="bg-secondary"
                  />
                  {ownsPets ? (
                    <ScoreMeter
                      label="Pet Preparedness Score"
                      percent={petScore}
                      icon={PawPrint}
                      accentClass="bg-primary"
                    />
                  ) : null}
                </div>

                <div className="rounded-2xl border border-border/60 bg-brand-primary-light/30 px-5 py-4 text-center">
                  <Typography
                    variant="p"
                    color="muted"
                    className="text-sm leading-relaxed"
                  >
                    {ownsPets && petScore < 80
                      ? "Protect the pets you love by keeping vaccinations, medications, microchip details, and vet contacts ready for emergency care."
                      : familyScore < 80
                        ? "Protect the people you love by keeping medications, allergies, and emergency contacts ready when something unexpected happens."
                        : "You're in good shape — keep records updated so they're ready whenever you need them."}
                  </Typography>
                </div>

                <div className="flex flex-wrap justify-center gap-3">
                  <Button asChild size="lg">
                    <Link href="/signup">Get Started</Link>
                  </Button>
                  {ownsPets ? (
                    <Button asChild size="lg" variant="outline">
                      <Link href={"/pet-profiles" as Route}>
                        Learn About Pet Profiles
                      </Link>
                    </Button>
                  ) : null}
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={resetAssessment}
                  >
                    Retake assessment
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-3xl overflow-hidden rounded-2xl border border-secondary/20 bg-secondary">
          <div className="flex flex-col items-center gap-4 px-6 py-6 text-center sm:flex-row sm:px-8 sm:text-left">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white/15 text-white">
              <ShieldCheck className="size-5" aria-hidden />
            </span>
            <Typography
              variant="p"
              color="inherit"
              className="text-sm leading-relaxed text-white/90 sm:text-base"
            >
              For less than a dollar a day, protect the people—and pets—you love
              by keeping their important health information ready when something
              unexpected happens.
            </Typography>
          </div>
        </div>
      </div>
    </section>
  )
}
