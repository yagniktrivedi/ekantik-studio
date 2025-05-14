"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ClassForm from "../components/class-form";

export default function NewClassPage() {
  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin-dashboard/classes">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Add New Class</h1>
        </div>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Create New Class</CardTitle>
          <CardDescription>
            Fill out the form below to create a new class for your studio.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ClassForm />
        </CardContent>
      </Card>
    </div>
  );
}
