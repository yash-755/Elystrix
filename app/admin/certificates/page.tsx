"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Search,
  MoreHorizontal,
  Eye,
  XCircle,
  CheckCircle,
  Download,
  Award,
  Crown,
  Sparkles,
  FileText,
  RefreshCw,
} from "lucide-react"

const certificates: any[] = []

export default function AdminCertificatesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredCertificates = certificates.filter((cert) => {
    const matchesSearch =
      cert.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.student.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.course.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === "all" || cert.type === typeFilter
    const matchesStatus = statusFilter === "all" || cert.status === statusFilter
    return matchesSearch && matchesType && matchesStatus
  })

  const getCertTypeBadge = (type: string) => {
    switch (type) {
      case "gold":
        return (
          <Badge className="bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/30 gold-glow-sm">
            <Crown className="h-3 w-3 mr-1" />
            Premium
          </Badge>
        )
      case "silver":
        return (
          <Badge className="bg-[#c0c0c0]/20 text-[#a0a0a0] border border-[#c0c0c0]/30">
            <Sparkles className="h-3 w-3 mr-1" />
            Career
          </Badge>
        )
      default:
        return (
          <Badge variant="outline">
            <FileText className="h-3 w-3 mr-1" />
            Basic
          </Badge>
        )
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return (
          <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20">
            <CheckCircle className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="text-yellow-600 border-yellow-600">
            Pending
          </Badge>
        )
      case "revoked":
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Revoked
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Certificate Management</h1>
          <p className="text-muted-foreground">Issue, verify, and manage certificates</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Award className="h-4 w-4 mr-2" />
            Issue Certificate
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Award className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{certificates.length}</p>
                <p className="text-xs text-muted-foreground">Total Issued</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#d4af37]/10 flex items-center justify-center">
                <Crown className="h-5 w-5 text-[#d4af37]" />
              </div>
              <div>
                <p className="text-2xl font-bold">{certificates.filter((c) => c.type === "gold").length}</p>
                <p className="text-xs text-muted-foreground">Premium Certificates</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#c0c0c0]/10 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-[#a0a0a0]" />
              </div>
              <div>
                <p className="text-2xl font-bold">{certificates.filter((c) => c.type === "silver").length}</p>
                <p className="text-xs text-muted-foreground">Career Certificates</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{certificates.reduce((acc, c) => acc + c.verifications, 0)}</p>
                <p className="text-xs text-muted-foreground">Verifications</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by ID, student, or course..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="gold">Premium</SelectItem>
                <SelectItem value="silver">Career</SelectItem>
                <SelectItem value="white">Basic</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="revoked">Revoked</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Certificates Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Certificate ID</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Verifications</TableHead>
                <TableHead>Issued</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCertificates.map((cert) => (
                <TableRow key={cert.id}>
                  <TableCell>
                    <code className="text-xs bg-secondary px-2 py-1 rounded">{cert.id}</code>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{cert.student}</p>
                      <p className="text-xs text-muted-foreground">{cert.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>{cert.course}</TableCell>
                  <TableCell>{getCertTypeBadge(cert.type)}</TableCell>
                  <TableCell>{getStatusBadge(cert.status)}</TableCell>
                  <TableCell className="text-center">{cert.verifications}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{cert.issuedAt}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View Certificate
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" />
                          Download PDF
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {cert.status === "revoked" ? (
                          <DropdownMenuItem className="text-green-600">
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Reinstate
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem className="text-red-500">
                            <XCircle className="h-4 w-4 mr-2" />
                            Revoke
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
