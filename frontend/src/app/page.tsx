import Footer from "./_components/footer";
import Image from "next/image";

import PredictionForm from "./_components/prediction-form";

export default async function Home() {
  // fetch locations
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/locations`
  );

  const locations = await response.json();

  console.log(locations[0]);

  return (
    <div className="container max-w-3xl mx-auto px-4 py-8 pb-20 min-h-screen flex flex-col justify-between">
      <main className="bg-white shadow-md rounded-lg p-8">
        <div>
          <div className="flex justify-center mb-4 animate-bounce">
            <Image
              aria-hidden
              src="/house.png"
              alt="House icon"
              width={100}
              height={100}
            />
          </div>
          <h1 className="font-semibold text-3xl text-center">
            Bangalore Housing Price Prediction
          </h1>
          <p className="text-center text-sm text-muted-foreground">
            This machine learning model predicts the price of houses in
            Bangalore based on various features such as location, size, number
            of bedrooms, and more. Note: This is a demo application and may not
            reflect current pricing trends.
          </p>
          <hr className="my-4" />
        </div>
        <PredictionForm locations={locations} />
      </main>

      <Footer />
    </div>
  );
}
