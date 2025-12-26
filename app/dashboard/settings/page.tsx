"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Loader2 } from "lucide-react"
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { getUserProfile, updateUserProfile } from "@/app/actions/user";
import { toast } from "sonner";
import { ProfileHeader } from "@/components/dashboard/settings/profile-header";
import { BasicInfoCard } from "@/components/dashboard/settings/basic-info-card";
import { EducationCard } from "@/components/dashboard/settings/education-card";
import { CareerCard } from "@/components/dashboard/settings/career-card";
import { SocialsCard } from "@/components/dashboard/settings/socials-card";

export default function SettingsPage() {
  const [user, loadingAuth] = useAuthState(auth);
  const [dbUser, setDbUser] = useState<any>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      if (user?.uid) {
        setLoadingData(true);
        const profile = await getUserProfile(user.uid);
        setDbUser(profile);
        setLoadingData(false);
      } else if (!loadingAuth && !user) {
        setLoadingData(false);
      }
    }
    fetchProfile();
  }, [user, loadingAuth]);

  const handleSave = async (data: any) => {
    if (!user) return
    setSaving(true)
    try {
      const result = await updateUserProfile(user.uid, data)
      if (result.success) {
        setDbUser((prev: any) => ({ ...prev, ...data }))
        toast.success("Profile updated successfully")
      } else {
        toast.error(result.error || "Failed to update profile")
      }
    } catch (error) {
      console.error(error)
      toast.error("Something went wrong")
    } finally {
      setSaving(false)
    }
  }

  if (loadingAuth || loadingData) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <div>Please log in to view settings.</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:inline-grid">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          {/* <TabsTrigger value="notifications">Notifications</TabsTrigger> */}
          {/* Notifications, Billing, Security hidden until backend support is added to prevent fake data */}
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <ProfileHeader
            user={dbUser}
            firebaseUser={user}
            onSave={handleSave}
            saving={saving}
          />

          <Separator />

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-6">
              <BasicInfoCard user={dbUser} onSave={handleSave} saving={saving} />
              <SocialsCard user={dbUser} onSave={handleSave} saving={saving} />
            </div>
            <div className="space-y-6">
              <CareerCard user={dbUser} onSave={handleSave} saving={saving} />
              <EducationCard user={dbUser} onSave={handleSave} saving={saving} />
            </div>
          </div>
        </TabsContent>
        {/* Other tabs hidden to avoid hardcoded mock data */}
      </Tabs>
    </div>
  )
}
