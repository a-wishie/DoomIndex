import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

const DisasterDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [disasters, setDisasters] = useState([]);
  const [selectedDisaster, setSelectedDisaster] = useState(null);
  const [disasterDetails, setDisasterDetails] = useState(null);
  const [question, setQuestion] = useState('');
  const [chatResponse, setChatResponse] = useState('');

  useEffect(() => {
    if (searchTerm.length > 2) {
      fetch(`http://localhost:5000/api/search?term=${searchTerm}`)
        .then(res => res.json())
        .then(data => setDisasters(data));
    }
  }, [searchTerm]);

  useEffect(() => {
    if (selectedDisaster !== null) {
      fetch(`http://localhost:5000/api/disaster/${selectedDisaster}`)
        .then(res => res.json())
        .then(data => setDisasterDetails(data));
    }
  }, [selectedDisaster]);

  const handleChat = async () => {
    if (!question) return;
    
    const response = await fetch('http://localhost:5000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        disaster_id: selectedDisaster,
        question: question
      }),
    });
    
    const data = await response.json();
    setChatResponse(data.response);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8">Civic Response Assistant Dashboard</h1>
      
      <div className="mb-8">
        <div className="relative">
          <input
            type="text"
            className="w-full p-4 rounded-lg border border-gray-300"
            placeholder="Search for a disaster (e.g., country, year, disaster type)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute right-4 top-4 text-gray-400" />
        </div>
        
        {disasters.length > 0 && (
          <select
            className="w-full mt-4 p-4 rounded-lg border border-gray-300"
            onChange={(e) => setSelectedDisaster(Number(e.target.value))}
          >
            <option value="">Select a disaster</option>
            {disasters.map((disaster, index) => (
              <option key={index} value={index}>
                {disaster.Year} - {disaster.Country} - {disaster['Disaster Type']}
              </option>
            ))}
          </select>
        )}
      </div>

      {disasterDetails && (
        <>
          <div className="grid grid-cols-3 gap-4 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Year</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl">{disasterDetails.disaster.Year}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Total Deaths</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl">{disasterDetails.disaster['Total Deaths']}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Total Affected</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl">{disasterDetails.disaster['Total Affected']}</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="summary" className="w-full">
            <TabsList>
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="public">Public Information</TabsTrigger>
              <TabsTrigger value="engagement">Citizen Engagement</TabsTrigger>
              <TabsTrigger value="education">Educational Content</TabsTrigger>
            </TabsList>

            <TabsContent value="summary">
              <Alert>
                <AlertTitle>Disaster Summary</AlertTitle>
                <AlertDescription>{disasterDetails.summary}</AlertDescription>
              </Alert>
            </TabsContent>

            <TabsContent value="public">
              <Alert>
                <AlertTitle>Public Information and Updates</AlertTitle>
                <AlertDescription>{disasterDetails.public_info}</AlertDescription>
              </Alert>
            </TabsContent>

            <TabsContent value="engagement">
              <div className="grid grid-cols-2 gap-4">
                <Alert>
                  <AlertTitle>Citizen Engagement Plan</AlertTitle>
                  <AlertDescription>{disasterDetails.engagement}</AlertDescription>
                </Alert>

                <Card>
                  <CardHeader>
                    <CardTitle>Disaster Response Chatbot</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <input
                        type="text"
                        className="w-full p-2 rounded border"
                        placeholder="Ask a question about the disaster..."
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleChat()}
                      />
                      {chatResponse && (
                        <Alert>
                          <AlertDescription>{chatResponse}</AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="education">
              <Alert>
                <AlertTitle>Educational Content</AlertTitle>
                <AlertDescription>
                  {disasterDetails.education.split('\n\n').map((section, index) => (
                    <div key={index} className="mb-4">
                      <h3 className="font-bold mb-2">Section {index + 1}</h3>
                      <p>{section}</p>
                    </div>
                  ))}
                </AlertDescription>
              </Alert>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default DisasterDashboard;