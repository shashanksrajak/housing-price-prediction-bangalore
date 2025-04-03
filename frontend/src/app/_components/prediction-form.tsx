"use client";
import { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Zap } from "lucide-react";
import { getPrediction } from "@/actions/prediction-action";

const formSchema = z.object({
  bhk: z.coerce.number().min(1).max(30),
  bath: z.coerce.number().min(1).max(30),
  total_sqft: z.coerce.number().min(10).max(10000),
  location: z.string(),
});

export default function PredictionForm({ locations }: { locations: string[] }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const [uiState, setUiState] = useState("form"); // form, success
  const [predictedPrice, setPredictedPrice] = useState<number | null>(null);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log(values);
      // Call the prediction API here
      const response = await getPrediction(values);
      if (response.error) {
        toast.error("Failed to fetch prediction");
        return;
      }

      // Assuming the response contains the predicted price
      const predictedPrice = response.data.predicted_price;
      setPredictedPrice(predictedPrice);

      setUiState("success");
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  if (uiState === "success") {
    // render predicted price here
    return (
      <div>
        <h2 className="text-2xl font-semibold text-center">
          Predicted Price:{" "}
          <span className="text-green-700">
            {predictedPrice &&
              `₹ ${Math.round(predictedPrice * 100000).toLocaleString(
                "en-IN"
              )}`}
          </span>
        </h2>

        <div className="mt-4">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">Your Input</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-semibold">BHK:</span>
                <span>{form.getValues("bhk")}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Bathrooms:</span>
                <span>{form.getValues("bath")}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Total Area (sqft):</span>
                <span>{form.getValues("total_sqft")}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Location:</span>
                <span>{form.getValues("location")}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-4">
          <Button
            variant={"outline"}
            onClick={() => {
              form.reset();
              setUiState("form");
            }}
          >
            Make Another Prediction
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <p className="text-center text-muted-foreground">
        Please fill in the details below to get a prediction of the house price.
      </p>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-3xl mx-auto py-10"
      >
        <FormField
          control={form.control}
          name="bhk"
          render={({ field }) => (
            <FormItem>
              <FormLabel>BHK</FormLabel>
              <FormControl>
                <Input placeholder="" type="number" {...field} />
              </FormControl>
              <FormDescription>Number of bedrooms</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bath"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bathrooms</FormLabel>
              <FormControl>
                <Input placeholder="" type="number" {...field} />
              </FormControl>
              <FormDescription>Number of bathrooms</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="total_sqft"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Area (in sqft)</FormLabel>
              <FormControl>
                <Input placeholder="" type="number" {...field} />
              </FormControl>
              <FormDescription>Total area of house in sqft</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>Select a location for the house</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? (
            <span className="flex items-center">
              <span className="loader mr-2"></span> Predicting...
            </span>
          ) : (
            <>
              Predict House Price <Zap />
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
