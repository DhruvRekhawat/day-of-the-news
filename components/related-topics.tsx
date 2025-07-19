"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

interface Topic {
  name: string;
  icon: string;
  count?: number;
}

const topics: Topic[] = [
  { name: "Cricket", icon: "🏏" },
  { name: "Politics", icon: "🏛️" },
  { name: "International", icon: "🌍" },
  { name: "Football", icon: "⚽" },
  { name: "India", icon: "🇮🇳" },
  { name: "USA", icon: "🇺🇸" },
  { name: "Ronaldo", icon: "⚽" },
];

export function RelatedTopics() {
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());

  const toggleTopic = (topicName: string) => {
    const newExpanded = new Set(expandedTopics);
    if (newExpanded.has(topicName)) {
      newExpanded.delete(topicName);
    } else {
      newExpanded.add(topicName);
    }
    setExpandedTopics(newExpanded);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-800  p-6">
      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
        RELATED TOPICS
      </h3>
      <div className="space-y-3">
        {topics.map((topic) => (
          <div
            key={topic.name}
            className="border-b border-gray-200 last:border-b-0 pb-3 last:pb-0"
          >
            <button
              onClick={() => toggleTopic(topic.name)}
              className="w-full flex items-center justify-between hover:bg-gray-100 hover:dark:bg-gray-600  p-2 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-sm">{topic.icon}</span>
                </div>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {topic.name}
                </span>
              </div>
              {expandedTopics.has(topic.name) ? (
                <Minus className="h-4 w-4 text-gray-500" />
              ) : (
                <Plus className="h-4 w-4 text-gray-500" />
              )}
            </button>
            {expandedTopics.has(topic.name) && (
              <div className="mt-3 ml-11 text-sm text-gray-600 dark:text-gray-200">
                <p>
                  Related articles and content for {topic.name} will appear
                  here.
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
