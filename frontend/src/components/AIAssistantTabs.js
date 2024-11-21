import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';

const AIAssistantTabs = ({ disaster }) => {
  const [loading, setLoading] = useState(false);
  const [aiContent, setAIContent] = useState({
    summary: null,
    publicInfo: null,
    engagement: null,
    education: null
  });

  const simulateAIGeneration = async (tabKey, disasterData) => {
    setLoading(true);
    try {
      // Simulated async content generation
      const contents = {
        summary: `Comprehensive summary of the ${disasterData.disaster_type} disaster in ${disasterData.country} during ${disasterData.year}. Key insights include the total impact and critical observations.`,
        publicInfo: `Public safety information and emergency response guidelines for the ${disasterData.disaster_type} event. Includes recommended actions and critical contact information.`,
        engagement: `Citizen engagement strategies for community support and resilience in the aftermath of the ${disasterData.disaster_type}. Focuses on collaboration and mutual assistance.`,
        education: `Educational content about ${disasterData.disaster_type}, including prevention methods, early warning signs, and preparedness techniques for similar future events.`
      };

      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(contents[tabKey]);
          setLoading(false);
        }, 1500);
      });
    } catch (error) {
      console.error('AI Content Generation Error:', error);
      setLoading(false);
      return 'Failed to generate content';
    }
  };

  const handleTabChange = async (tabKey) => {
    // Only generate content if not already loaded
    if (!aiContent[tabKey]) {
      const content = await simulateAIGeneration(tabKey, disaster);
      setAIContent(prev => ({
        ...prev,
        [tabKey]: content
      }));
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <Tabs defaultValue="summary" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger 
              value="summary" 
              onClick={() => handleTabChange('summary')}
            >
              Summary
            </TabsTrigger>
            <TabsTrigger 
              value="publicInfo" 
              onClick={() => handleTabChange('publicInfo')}
            >
              Public Info
            </TabsTrigger>
            <TabsTrigger 
              value="engagement" 
              onClick={() => handleTabChange('engagement')}
            >
              Engagement
            </TabsTrigger>
            <TabsTrigger 
              value="education" 
              onClick={() => handleTabChange('education')}
            >
              Education
            </TabsTrigger>
          </TabsList>

          {/* Summary Tab Content */}
          <TabsContent value="summary" className="mt-4">
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <Spinner />
              </div>
            ) : (
              <div className="p-4 bg-gray-100 rounded-lg">
                {aiContent.summary || 'Click to generate summary'}
              </div>
            )}
          </TabsContent>

          {/* Public Info Tab Content */}
          <TabsContent value="publicInfo" className="mt-4">
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <Spinner />
              </div>
            ) : (
              <div className="p-4 bg-gray-100 rounded-lg">
                {aiContent.publicInfo || 'Click to generate public information'}
              </div>
            )}
          </TabsContent>

          {/* Engagement Tab Content */}
          <TabsContent value="engagement" className="mt-4">
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <Spinner />
              </div>
            ) : (
              <div className="p-4 bg-gray-100 rounded-lg">
                {aiContent.engagement || 'Click to generate engagement strategies'}
              </div>
            )}
          </TabsContent>

          {/* Education Tab Content */}
          <TabsContent value="education" className="mt-4">
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <Spinner />
              </div>
            ) : (
              <div className="p-4 bg-gray-100 rounded-lg">
                {aiContent.education || 'Click to generate educational content'}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AIAssistantTabs;