"use client"

import type React from "react"

import { useState } from "react"
import { AppLayout } from "@/components/layouts/app-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Bell, Check, Dog, Calendar, User, Clock, AlertTriangle, Info } from "lucide-react"

type NotificationType = "alert" | "info" | "success" | "warning"

type NotificationCategory = "all" | "dogs" | "assignments" | "system"

interface Notification {
  id: string
  title: string
  message: string
  timestamp: string
  read: boolean
  type: NotificationType
  category: NotificationCategory
  icon?: React.ReactNode
  action?: string
}

export function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<NotificationCategory>("all")
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Assignment Completed",
      message: "Marvin has completed the search and rescue assignment.",
      timestamp: "10 minutes ago",
      read: false,
      type: "success",
      category: "assignments",
      icon: <Calendar className="h-5 w-5 text-green-500" />,
      action: "View Assignment",
    },
    {
      id: "2",
      title: "New Handler Assigned",
      message: "Emma Johnson has been assigned to Rex.",
      timestamp: "1 hour ago",
      read: false,
      type: "info",
      category: "dogs",
      icon: <User className="h-5 w-5 text-blue-500" />,
      action: "View Details",
    },
    {
      id: "3",
      title: "Low Battery Alert",
      message: "Bella's tracking device is running low on battery (15%).",
      timestamp: "3 hours ago",
      read: true,
      type: "warning",
      category: "dogs",
      icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
      action: "Acknowledge",
    },
    {
      id: "4",
      title: "System Maintenance",
      message: "CyDog will be undergoing maintenance on Friday at 2 AM EST.",
      timestamp: "1 day ago",
      read: true,
      type: "info",
      category: "system",
      icon: <Info className="h-5 w-5 text-blue-500" />,
    },
    {
      id: "5",
      title: "Training Session Reminder",
      message: "Scheduled training session with Max tomorrow at 10 AM.",
      timestamp: "1 day ago",
      read: true,
      type: "info",
      category: "assignments",
      icon: <Clock className="h-5 w-5 text-blue-500" />,
      action: "Set Reminder",
    },
    {
      id: "6",
      title: "Health Check Required",
      message: "Marvin is due for a health check this week.",
      timestamp: "2 days ago",
      read: true,
      type: "warning",
      category: "dogs",
      icon: <Dog className="h-5 w-5 text-yellow-500" />,
      action: "Schedule",
    },
  ])

  const filteredNotifications =
    activeTab === "all" ? notifications : notifications.filter((n) => n.category === activeTab)

  const unreadCount = notifications.filter((n) => !n.read).length
  const categoryCount = {
    all: notifications.length,
    dogs: notifications.filter((n) => n.category === "dogs").length,
    assignments: notifications.filter((n) => n.category === "assignments").length,
    system: notifications.filter((n) => n.category === "system").length,
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }

  return (
    <AppLayout>
      <div className="container mx-auto p-6">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center">
            <h1 className="text-3xl font-bold text-white">Notifications</h1>
            {unreadCount > 0 && <Badge className="ml-3 bg-teal-500 dark:bg-teal-600">{unreadCount} new</Badge>}
          </div>

          <Button
            variant="outline"
            className="border-teal-600 dark:border-teal-700 text-white hover:bg-teal-700 dark:hover:bg-teal-800"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            <Check className="mr-2 h-4 w-4" /> Mark all as read
          </Button>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as NotificationCategory)}
          className="space-y-6"
        >
          <TabsList className="bg-teal-900/50 dark:bg-slate-900/50">
            <TabsTrigger value="all" className="data-[state=active]:bg-teal-700 dark:data-[state=active]:bg-teal-800">
              All ({categoryCount.all})
            </TabsTrigger>
            <TabsTrigger value="dogs" className="data-[state=active]:bg-teal-700 dark:data-[state=active]:bg-teal-800">
              <Dog className="mr-2 h-4 w-4" /> Dogs ({categoryCount.dogs})
            </TabsTrigger>
            <TabsTrigger
              value="assignments"
              className="data-[state=active]:bg-teal-700 dark:data-[state=active]:bg-teal-800"
            >
              <Calendar className="mr-2 h-4 w-4" /> Assignments ({categoryCount.assignments})
            </TabsTrigger>
            <TabsTrigger
              value="system"
              className="data-[state=active]:bg-teal-700 dark:data-[state=active]:bg-teal-800"
            >
              <Bell className="mr-2 h-4 w-4" /> System ({categoryCount.system})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            <Card className="bg-teal-800/50 dark:bg-slate-800/50 text-white border-teal-700 dark:border-slate-700">
              <CardHeader>
                <CardTitle>
                  {activeTab === "all"
                    ? "All Notifications"
                    : activeTab === "dogs"
                      ? "Dog Notifications"
                      : activeTab === "assignments"
                        ? "Assignment Notifications"
                        : "System Notifications"}
                </CardTitle>
                <CardDescription className="text-teal-100 dark:text-slate-300">
                  {activeTab === "all" ? "All your recent notifications" : `Notifications related to ${activeTab}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredNotifications.length > 0 ? (
                    filteredNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`rounded-lg p-4 transition-colors ${
                          notification.read
                            ? "bg-teal-900/30 dark:bg-slate-900/30"
                            : "bg-teal-700/40 dark:bg-teal-800/40 border-l-4 border-teal-500 dark:border-teal-600"
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className="rounded-full bg-teal-900/50 dark:bg-slate-900/50 p-2">
                            {notification.icon || <Bell className="h-5 w-5 text-teal-400 dark:text-teal-500" />}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium">{notification.title}</h3>
                              <span className="text-xs text-teal-100 dark:text-slate-300">
                                {notification.timestamp}
                              </span>
                            </div>
                            <p className="mt-1 text-sm text-teal-100 dark:text-slate-300">{notification.message}</p>

                            {notification.action && (
                              <div className="mt-3 flex justify-end">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-xs border-teal-600 dark:border-teal-700 text-white hover:bg-teal-700 dark:hover:bg-teal-800"
                                >
                                  {notification.action}
                                </Button>

                                {!notification.read && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-xs ml-2 text-teal-100 dark:text-slate-300 hover:text-white hover:bg-teal-700/50 dark:hover:bg-teal-800/50"
                                    onClick={() => markAsRead(notification.id)}
                                  >
                                    Mark as read
                                  </Button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Bell className="h-12 w-12 text-teal-400/50 dark:text-teal-500/50 mb-4" />
                      <h3 className="text-lg font-medium">No notifications</h3>
                      <p className="text-teal-100 dark:text-slate-300 mt-1">
                        You don't have any {activeTab === "all" ? "" : `${activeTab} `}notifications at the moment
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}
