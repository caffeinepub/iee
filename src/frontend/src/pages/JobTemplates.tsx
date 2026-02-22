import { useGetJobTemplates } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { FileText, Plus } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

export default function JobTemplates() {
  const { data: templates, isLoading } = useGetJobTemplates();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading templates...</p>
        </div>
      </div>
    );
  }

  if (!templates || templates.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Job Templates</h1>
            <p className="text-muted-foreground">Save and reuse job posting configurations</p>
          </div>

          <Card>
            <CardContent className="py-16 text-center">
              <img
                src="/assets/generated/icon-template.dim_64x64.png"
                alt="No templates"
                className="w-20 h-20 mx-auto mb-6 opacity-50"
              />
              <h3 className="text-xl font-semibold mb-2">No templates yet</h3>
              <p className="text-muted-foreground mb-6">
                Create job templates to quickly post similar jobs in the future
              </p>
              <Button onClick={() => navigate({ to: '/employer/jobs/create' })}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Job
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Job Templates</h1>
            <p className="text-muted-foreground">
              {templates.length} template{templates.length !== 1 ? 's' : ''} saved
            </p>
          </div>
          <Button onClick={() => navigate({ to: '/employer/jobs/create' })}>
            <Plus className="h-4 w-4 mr-2" />
            Create New Job
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {templates.map((template) => (
            <Card key={template.templateId}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <img
                    src="/assets/generated/icon-template.dim_64x64.png"
                    alt="Template"
                    className="w-8 h-8"
                  />
                  <CardTitle>{template.templateName}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Required Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {template.requiredSkills.slice(0, 3).map((skillData, index) => (
                        <Badge key={`${skillData.skill}-${index}`} variant="secondary">
                          {skillData.skill.replace(/([A-Z])/g, ' $1').trim()}
                        </Badge>
                      ))}
                      {template.requiredSkills.length > 3 && (
                        <Badge variant="outline">+{template.requiredSkills.length - 3} more</Badge>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Wage</p>
                      <p className="font-semibold">₹{template.wageAmount}/day</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Duration</p>
                      <p className="font-semibold">{template.duration} days</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Shift</p>
                      <p className="font-semibold">{template.shiftTiming}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Workers</p>
                      <p className="font-semibold">{Number(template.workerCount)}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Description</p>
                    <p className="text-sm line-clamp-2">{template.jobDescription}</p>
                  </div>

                  <Button
                    onClick={() => navigate({ to: '/employer/jobs/create' })}
                    variant="outline"
                    className="w-full"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Use This Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
