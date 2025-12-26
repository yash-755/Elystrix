"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Search,
    MoreHorizontal,
    DownloadCloud,
    UserPlus,
    CheckCircle,
    Shield,
    MapPin,
    Briefcase,
    GraduationCap,
    Linkedin,
    Globe,
    Mail,
    Phone
} from "lucide-react"

type User = {
    id: string
    name: string | null
    email: string
    role: string
    plan: string | null
    profileImageUrl?: string | null
    createdAt: string
    subscriptionStatus: string | null
    // Extended Data
    careerStatus?: string | null
    targetRole?: string | null
    skills?: string[]
    city?: string | null
    country?: string | null
    degree?: string | null
    college?: string | null
    linkedinProfile?: string | null
    bio?: string | null
    phone?: string | null
}

export function UsersTable({ initialUsers }: { initialUsers: User[] }) {
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [selectedUser, setSelectedUser] = useState<User | null>(null)

    // Client-side filtering
    const filteredUsers = initialUsers.filter((user) => {
        const query = searchQuery.toLowerCase()
        const matchesSearch = (
            (user.name?.toLowerCase().includes(query) || false) ||
            user.email.toLowerCase().includes(query) ||
            (user.targetRole?.toLowerCase().includes(query) || false)
        )
        const matchesStatus = statusFilter === "all" || user.careerStatus === statusFilter

        return matchesSearch && matchesStatus
    })

    const getStatusBadge = (status: string | null) => {
        const s = status || "active"
        switch (s) {
            case "active":
                return (
                    <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Active
                    </Badge>
                )
            default:
                return <Badge variant="outline">{s}</Badge>
        }
    }

    const getPlanBadge = (plan: string | null) => {
        switch (plan) {
            case "elite":
                return (
                    <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">
                        <Shield className="h-3 w-3 mr-1" />
                        Elite
                    </Badge>
                )
            case "pro":
                return <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">Pro</Badge>
            default:
                return <Badge variant="outline" className="text-muted-foreground">Free</Badge>
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
                    <p className="text-muted-foreground">Monitor student progress and profiles.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <DownloadCloud className="h-4 w-4 mr-2" />
                        Export
                    </Button>
                    <Button>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Add User
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-4 flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by name, email, or role..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full sm:w-[200px]">
                            <SelectValue placeholder="Career Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="Student">Student</SelectItem>
                            <SelectItem value="Job Seeker">Job Seeker</SelectItem>
                            <SelectItem value="Working Professional">Working Professional</SelectItem>
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>

            {/* Users Table */}
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead className="hidden md:table-cell">Role / Status</TableHead>
                                <TableHead className="hidden lg:table-cell">Location</TableHead>
                                <TableHead>Plan</TableHead>
                                <TableHead className="hidden md:table-cell">Joined</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                                        No users found matching your filters.
                                    </TableCell>
                                </TableRow>
                            ) : filteredUsers.map((user) => (
                                <TableRow key={user.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelectedUser(user)}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={user.profileImageUrl || undefined} />
                                                <AvatarFallback>{(user.name || "U").charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{user.name || "Unnamed User"}</p>
                                                <p className="text-xs text-muted-foreground">{user.email}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-sm text-foreground">{user.targetRole || "—"}</span>
                                            <span className="text-xs text-muted-foreground mt-0.5">
                                                {user.careerStatus ? (
                                                    <span className="flex items-center gap-1.5 pt-0.5">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                                                        {user.careerStatus}
                                                    </span>
                                                ) : <span className="italic opacity-50">Status unset</span>}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden lg:table-cell">
                                        {(user.city || user.country) ? (
                                            <div className="flex items-center text-sm text-muted-foreground">
                                                <MapPin className="w-3.5 h-3.5 mr-1.5 text-muted-foreground/60" />
                                                {[user.city, user.country].filter(Boolean).join(", ")}
                                            </div>
                                        ) : <span className="text-muted-foreground/50 text-sm">—</span>}
                                    </TableCell>
                                    <TableCell>{getPlanBadge(user.plan)}</TableCell>
                                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => setSelectedUser(user)}>View Profile</DropdownMenuItem>
                                                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); /* Handle email */ }}>Email User</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-destructive">Ban User</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* User Details Sheet */}
            <Sheet open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
                <SheetContent className="overflow-y-auto sm:max-w-md w-full">
                    <SheetHeader className="pb-6 space-y-4">
                        <div className="flex flex-col items-center text-center gap-4">
                            <Avatar className="h-24 w-24 border-4 border-muted">
                                <AvatarImage src={selectedUser?.profileImageUrl || undefined} />
                                <AvatarFallback className="text-2xl">{(selectedUser?.name || "U").charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <SheetTitle className="text-xl">{selectedUser?.name}</SheetTitle>
                                <SheetDescription>{selectedUser?.email}</SheetDescription>
                                {selectedUser?.careerStatus && (
                                    <Badge variant="secondary" className="mt-2">{selectedUser.careerStatus}</Badge>
                                )}
                            </div>
                        </div>
                    </SheetHeader>

                    {selectedUser && (
                        <div className="space-y-6">
                            {/* Contact */}
                            <div className="space-y-3">
                                <h4 className="text-sm font-semibold uppercase text-muted-foreground tracking-wider">Contact</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-muted-foreground" />
                                        <span>{selectedUser.email}</span>
                                    </div>
                                    {selectedUser.phone && (
                                        <div className="flex items-center gap-2">
                                            <Phone className="w-4 h-4 text-muted-foreground" />
                                            <span>{selectedUser.phone}</span>
                                        </div>
                                    )}
                                    {selectedUser.linkedinProfile && (
                                        <div className="flex items-center gap-2">
                                            <Linkedin className="w-4 h-4 text-[#0077b5]" />
                                            <a href={selectedUser.linkedinProfile} target="_blank" className="hover:underline truncate text-sm">LinkedIn Profile</a>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* About */}
                            {selectedUser.bio && (
                                <div className="space-y-2">
                                    <h4 className="text-sm font-semibold uppercase text-muted-foreground tracking-wider">Bio</h4>
                                    <p className="text-sm leading-relaxed text-foreground/90">{selectedUser.bio}</p>
                                </div>
                            )}

                            {/* Skills */}
                            {selectedUser.skills && selectedUser.skills.length > 0 && (
                                <div className="space-y-3">
                                    <h4 className="text-sm font-semibold uppercase text-muted-foreground tracking-wider">Skills</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedUser.skills.map(skill => (
                                            <Badge key={skill} variant="outline" className="font-normal">{skill}</Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Education */}
                            {(selectedUser.degree || selectedUser.college) && (
                                <div className="space-y-3">
                                    <h4 className="text-sm font-semibold uppercase text-muted-foreground tracking-wider">Education</h4>
                                    <Card className="bg-muted/30">
                                        <CardContent className="p-4 flex items-start gap-3">
                                            <GraduationCap className="w-5 h-5 text-primary mt-0.5" />
                                            <div>
                                                <p className="font-medium text-sm">{selectedUser.degree || "Degree N/A"}</p>
                                                <p className="text-xs text-muted-foreground">{selectedUser.college}</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}

                            {/* Location */}
                            {(selectedUser.city || selectedUser.country) && (
                                <div className="space-y-2">
                                    <h4 className="text-sm font-semibold uppercase text-muted-foreground tracking-wider">Location</h4>
                                    <div className="flex items-center gap-2 text-sm">
                                        <MapPin className="w-4 h-4 text-muted-foreground" />
                                        <span>{[selectedUser.city, selectedUser.country].filter(Boolean).join(", ")}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    )
}
