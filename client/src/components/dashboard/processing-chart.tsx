import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3 } from "lucide-react";
import { useState } from "react";

export default function ProcessingChart() {
  const [selectedPeriod, setSelectedPeriod] = useState("7D");

  return (
    <Card data-testid="card-processing-chart">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Processing Volume
          </CardTitle>
          <div className="flex space-x-2">
            {["7D", "30D", "90D"].map((period) => (
              <Button
                key={period}
                variant={selectedPeriod === period ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPeriod(period)}
                data-testid={`button-period-${period.toLowerCase()}`}
              >
                {period}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="chart-container bg-muted/20 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="w-16 h-16 text-muted-foreground mb-4 mx-auto" />
            <p className="text-muted-foreground font-medium" data-testid="text-chart-placeholder">
              Chart visualization will be rendered here
            </p>
            <p className="text-xs text-muted-foreground mt-2" data-testid="text-chart-info">
              Processing volume for the last {selectedPeriod.toLowerCase()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
