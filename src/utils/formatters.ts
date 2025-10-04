// Utility functions for formatting data

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 7) {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
    });
  } else if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else {
    return 'Just now';
  }
}

export function getLanguageFromFile(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();
  
  const languageMap: { [key: string]: string } = {
    'js': 'JavaScript',
    'jsx': 'JavaScript',
    'ts': 'TypeScript',
    'tsx': 'TypeScript',
    'py': 'Python',
    'java': 'Java',
    'cpp': 'C++',
    'c': 'C',
    'cs': 'C#',
    'go': 'Go',
    'rb': 'Ruby',
    'php': 'PHP',
    'swift': 'Swift',
    'kt': 'Kotlin',
    'rs': 'Rust',
    'scala': 'Scala',
    'r': 'R',
    'sql': 'SQL',
    'html': 'HTML',
    'css': 'CSS',
    'scss': 'SCSS',
    'json': 'JSON',
    'xml': 'XML',
    'yaml': 'YAML',
    'yml': 'YAML',
    'md': 'Markdown',
  };
  
  return ext ? languageMap[ext] || 'Unknown' : 'Unknown';
}

export function getPrimaryLanguage(files: { filename: string }[]): string {
  const languages = files.map(f => getLanguageFromFile(f.filename));
  const counts: { [key: string]: number } = {};
  
  languages.forEach(lang => {
    counts[lang] = (counts[lang] || 0) + 1;
  });
  
  let maxLang = 'JavaScript';
  let maxCount = 0;
  
  Object.entries(counts).forEach(([lang, count]) => {
    if (count > maxCount && lang !== 'Unknown') {
      maxLang = lang;
      maxCount = count;
    }
  });
  
  return maxLang;
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function getStatusBadgeColor(status: string): string {
  const statusLower = status.toLowerCase();
  
  if (statusLower === 'open') return 'bg-green-500';
  if (statusLower === 'closed') return 'bg-red-500';
  if (statusLower === 'merged') return 'bg-purple-500';
  
  return 'bg-gray-500';
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}