"use client";

import { PullRequest } from '@/services/githubAPI';
import { formatDate, getStatusBadgeColor } from '@/utils/formatters';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GitPullRequest, User, Calendar, GitBranch } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface PRCardProps {
  pr: PullRequest;
  onReview: () => void;
}

export default function PRCard({ pr, onReview }: PRCardProps) {
  const statusColor = getStatusBadgeColor(pr.state);

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <GitPullRequest className="w-5 h-5 text-gray-500" />
              <CardTitle className="text-lg">#{pr.number} {pr.title}</CardTitle>
            </div>
            <CardDescription className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Avatar className="w-5 h-5">
                  <AvatarImage src={pr.user.avatar_url} alt={pr.user.login} />
                  <AvatarFallback>
                    <User className="w-3 h-3" />
                  </AvatarFallback>
                </Avatar>
                <span>{pr.user.login}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(pr.created_at)}</span>
              </div>
            </CardDescription>
          </div>
          <Badge className={`${statusColor} text-white border-none`}>
            {pr.state}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <GitBranch className="w-4 h-4" />
            <span className="font-mono">{pr.base.ref}</span>
            <span>←</span>
            <span className="font-mono">{pr.head.ref}</span>
          </div>
          <Button onClick={onReview} size="sm">
            Review with AI
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}