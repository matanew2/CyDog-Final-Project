"use client"

import type React from "react"

import { useState } from "react"
import { AppLayout } from "@/components/layouts/app-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/components/auth/auth-provider"
import { useToast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, Save, User, Lock, Bell, Shield, Upload } from "lucide-react"

export function SettingsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")

  const [profileSettings, setProfileSettings] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    bio: "",
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    dogAlerts: true,
    assignmentUpdates: true,
    marketingEmails: false,
  })

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: "30",
    passwordResetInterval: "90",
  })

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfileSettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleNotificationChange = (key: keyof typeof notificationSettings) => {
    setNotificationSettings((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSecurityChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setSecuritySettings((prev) => ({ ...prev, [name]: value }))
  }

  const saveSettings = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Settings saved",
        description: "Your settings have been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AppLayout>
      <div className="container mx-auto p-6">
        <h1 className="mb-6 text-3xl font-bold text-white">Settings</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-teal-900/50 dark:bg-slate-900/50">
            <TabsTrigger
              value="profile"
              className="data-[state=active]:bg-teal-700 dark:data-[state=active]:bg-teal-800"
            >
              <User className="mr-2 h-4 w-4" /> Profile
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="data-[state=active]:bg-teal-700 dark:data-[state=active]:bg-teal-800"
            >
              <Bell className="mr-2 h-4 w-4" /> Notifications
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="data-[state=active]:bg-teal-700 dark:data-[state=active]:bg-teal-800"
            >
              <Lock className="mr-2 h-4 w-4" /> Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card className="bg-teal-800/50 dark:bg-slate-800/50 text-white border-teal-700 dark:border-slate-700">
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription className="text-teal-100 dark:text-slate-300">
                  Manage your personal information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={profileSettings.name}
                        onChange={handleProfileChange}
                        className="bg-teal-900/50 dark:bg-slate-900/50 border-teal-700 dark:border-slate-700 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={profileSettings.email}
                        onChange={handleProfileChange}
                        className="bg-teal-900/50 dark:bg-slate-900/50 border-teal-700 dark:border-slate-700 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={profileSettings.phone}
                        onChange={handleProfileChange}
                        className="bg-teal-900/50 dark:bg-slate-900/50 border-teal-700 dark:border-slate-700 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <textarea
                        id="bio"
                        name="bio"
                        rows={4}
                        value={profileSettings.bio}
                        onChange={handleProfileChange}
                        className="w-full rounded-md bg-teal-900/50 dark:bg-slate-900/50 border border-teal-700 dark:border-slate-700 text-white p-2"
                      />
                    </div>
                  </div>

                  <div className="md:w-1/3 flex flex-col items-center">
                    <Avatar className="h-32 w-32 mb-4">
                      <AvatarImage src={user?.image || ""} alt={user?.name || "User"} />
                      <AvatarFallback className="bg-teal-700 dark:bg-teal-800 text-4xl">
                        {user?.name?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>

                    <Button className="mb-2 bg-teal-600 hover:bg-teal-500 dark:bg-teal-700 dark:hover:bg-teal-600">
                      <Upload className="mr-2 h-4 w-4" /> Upload Photo
                    </Button>

                    <p className="text-xs text-teal-100 dark:text-slate-300 text-center mt-2">
                      Recommended: Square image, at least 300x300px
                    </p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={saveSettings}
                    disabled={isLoading}
                    className="bg-teal-600 hover:bg-teal-500 dark:bg-teal-700 dark:hover:bg-teal-600"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" /> Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card className="bg-teal-800/50 dark:bg-slate-800/50 text-white border-teal-700 dark:border-slate-700">
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription className="text-teal-100 dark:text-slate-300">
                  Manage how you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-teal-100 dark:text-slate-300">Receive notifications via email</p>
                    </div>
                    <Switch
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={() => handleNotificationChange("emailNotifications")}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Push Notifications</p>
                      <p className="text-sm text-teal-100 dark:text-slate-300">Receive notifications on your device</p>
                    </div>
                    <Switch
                      checked={notificationSettings.pushNotifications}
                      onCheckedChange={() => handleNotificationChange("pushNotifications")}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Dog Alerts</p>
                      <p className="text-sm text-teal-100 dark:text-slate-300">
                        Get alerts about your dogs' activities
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.dogAlerts}
                      onCheckedChange={() => handleNotificationChange("dogAlerts")}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Assignment Updates</p>
                      <p className="text-sm text-teal-100 dark:text-slate-300">
                        Notifications about assignment changes
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.assignmentUpdates}
                      onCheckedChange={() => handleNotificationChange("assignmentUpdates")}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Marketing Emails</p>
                      <p className="text-sm text-teal-100 dark:text-slate-300">
                        Receive promotional emails and updates
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.marketingEmails}
                      onCheckedChange={() => handleNotificationChange("marketingEmails")}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={saveSettings}
                    disabled={isLoading}
                    className="bg-teal-600 hover:bg-teal-500 dark:bg-teal-700 dark:hover:bg-teal-600"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" /> Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card className="bg-teal-800/50 dark:bg-slate-800/50 text-white border-teal-700 dark:border-slate-700">
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription className="text-teal-100 dark:text-slate-300">
                  Manage your account security
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-teal-100 dark:text-slate-300">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Switch
                      checked={securitySettings.twoFactorAuth}
                      onCheckedChange={() =>
                        setSecuritySettings((prev) => ({ ...prev, twoFactorAuth: !prev.twoFactorAuth }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                    <select
                      id="sessionTimeout"
                      name="sessionTimeout"
                      value={securitySettings.sessionTimeout}
                      onChange={handleSecurityChange}
                      className="w-full rounded-md bg-teal-900/50 dark:bg-slate-900/50 border border-teal-700 dark:border-slate-700 text-white p-2"
                    >
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="60">1 hour</option>
                      <option value="120">2 hours</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="passwordResetInterval">Password Reset Interval (days)</Label>
                    <select
                      id="passwordResetInterval"
                      name="passwordResetInterval"
                      value={securitySettings.passwordResetInterval}
                      onChange={handleSecurityChange}
                      className="w-full rounded-md bg-teal-900/50 dark:bg-slate-900/50 border border-teal-700 dark:border-slate-700 text-white p-2"
                    >
                      <option value="30">30 days</option>
                      <option value="60">60 days</option>
                      <option value="90">90 days</option>
                      <option value="180">180 days</option>
                      <option value="never">Never</option>
                    </select>
                  </div>

                  <div className="pt-4">
                    <Button
                      variant="outline"
                      className="w-full border-teal-600 dark:border-teal-700 text-white hover:bg-teal-700 dark:hover:bg-teal-800"
                    >
                      <Lock className="mr-2 h-4 w-4" /> Change Password
                    </Button>
                  </div>

                  <div>
                    <Button
                      variant="outline"
                      className="w-full border-teal-600 dark:border-teal-700 text-white hover:bg-teal-700 dark:hover:bg-teal-800"
                    >
                      <Shield className="mr-2 h-4 w-4" /> View Login History
                    </Button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={saveSettings}
                    disabled={isLoading}
                    className="bg-teal-600 hover:bg-teal-500 dark:bg-teal-700 dark:hover:bg-teal-600"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" /> Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}
