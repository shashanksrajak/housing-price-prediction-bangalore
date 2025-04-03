"use server";

type HouseInput = {
  location: string;
  total_sqft: number;
  bath: number;
  bhk: number;
};

export const getPrediction = async (input: HouseInput) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/predict-home-price`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    }
  );

  if (!response.ok) {
    return {
      error: true,
      message: "Failed to fetch prediction",
    };
  }

  const data = await response.json();
  return {
    success: true,
    data: data,
  };
};
