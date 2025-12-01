import { GoogleGenAI, Type } from "@google/genai";
import { LocationData } from "../types";

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeImageLocation = async (base64Data: string, mimeType: string): Promise<LocationData> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', // Using Pro for better reasoning capabilities on complex visual tasks
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
          {
            text: `
              この画像を分析し、撮影された場所を特定してください。
              ランドマーク、建築様式、自然の特徴、文字情報（看板など）を詳細に観察してください。

              また、この場所を訪れるユーザーや、この写真のような体験をしたいユーザーにとって「あると便利」「役立つ」と思われるAmazonで購入可能な商品を、様々なジャンル（旅行ガイド、カメラ用品、アウトドア、ファッション、ガジェットなど）から1つだけ選定してください。
              
              以下の情報をJSON形式で出力してください：
              1. 場所の名前 (placeName): 具体的なランドマーク名や地域名
              2. 都市 (city): 都市名
              3. 国 (country): 国名
              4. 説明 (description): その場所についての簡潔な説明（歴史的背景や特徴など）
              5. 座標 (coordinates): 推定される緯度(latitude)と経度(longitude)。不明な場合はnull。
              6. 確信度 (confidence): "高", "中", "低" のいずれか
              7. 推論理由 (reasoning): 特定に至った視覚的な手がかりのリスト（文字列の配列）
              8. 推奨商品 (recommendation): 
                 - title: 商品名やカテゴリ（例：「GoPro Hero」「地球の歩き方 イタリア」「トレッキングシューズ」など具体的に）
                 - reason: なぜこの場所やシチュエーションでその商品がおすすめなのかの理由
                 - keywords: Amazon検索用のキーワード（スペース区切り）
            `
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            placeName: { type: Type.STRING },
            city: { type: Type.STRING },
            country: { type: Type.STRING },
            description: { type: Type.STRING },
            coordinates: {
              type: Type.OBJECT,
              properties: {
                latitude: { type: Type.NUMBER },
                longitude: { type: Type.NUMBER },
              },
              nullable: true,
            },
            confidence: { type: Type.STRING },
            reasoning: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            recommendation: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                reason: { type: Type.STRING },
                keywords: { type: Type.STRING }
              },
              required: ["title", "reason", "keywords"]
            }
          },
          required: ["placeName", "city", "country", "description", "confidence", "reasoning", "recommendation"]
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("AIからの応答が空でした。");
    }

    const data = JSON.parse(jsonText) as LocationData;
    return data;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("画像の解析に失敗しました。別の画像を試すか、しばらく待ってから再試行してください。");
  }
};