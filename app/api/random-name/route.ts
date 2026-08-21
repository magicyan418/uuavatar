import { NextResponse } from "next/server";

const RANDOM_NAME_API = "https://api.oick.cn/api/uname";
const REQUEST_TIMEOUT_MS = 6000;
const FALLBACK_NAMES = [
  "小云朵",
  "薄荷团子",
  "橘子汽水",
  "晚风同学",
  "星星邮差",
  "奶油曲奇",
  "森林来信",
  "月亮散步",
];

const getFallbackName = () =>
  FALLBACK_NAMES[Math.floor(Math.random() * FALLBACK_NAMES.length)];

export async function GET() {
  const apiKey = process.env.OICK_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { message: "随机名字服务未配置 API Key" },
      { status: 500 },
    );
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(
      `${RANDOM_NAME_API}?apikey=${encodeURIComponent(apiKey)}`,
      {
        headers: { Accept: "application/json" },
        cache: "no-store",
        signal: controller.signal,
      },
    );

    const body = await response.text();
    let result: unknown = body;

    try {
      result = JSON.parse(body);
    } catch {
      // Some versions of the API return the name as plain text.
    }

    if (!response.ok) {
      console.warn(`随机名字接口返回 ${response.status}，使用本地兜底名字`);
      return NextResponse.json(
        {
          name: getFallbackName(),
          fallback: true,
          message: "随机名字服务暂时不可用",
        },
      );
    }

    const name =
      typeof result === "string"
        ? result
        : typeof result === "object" && result !== null
          ? ["name", "data", "result", "username"]
              .map((key) => (result as Record<string, unknown>)[key])
              .find((value): value is string => typeof value === "string")
          : undefined;

    if (!name?.trim()) {
      return NextResponse.json(
        {
          name: getFallbackName(),
          fallback: true,
          message: "随机名字服务返回了无法识别的结果",
        },
      );
    }

    return NextResponse.json({ name: name.trim() });
  } catch (error) {
    console.warn("随机名字接口请求失败，使用本地兜底名字:", error);
    return NextResponse.json(
      {
        name: getFallbackName(),
        fallback: true,
        message: "随机名字接口暂时不可用，已使用本地名字",
      },
    );
  } finally {
    clearTimeout(timeout);
  }
}
