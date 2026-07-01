import { Helmet } from "react-helmet-async";
import { CLIENT_CONFIG } from "@/config/client";

interface Props {
  title: string;
  description: string;
  path?: string;
  jsonLd?: object | object[];
}

export function SEOHead({ title, description, path = "/", jsonLd }: Props) {
  const url = path;
  const fullTitle = title.includes(CLIENT_CONFIG.shortName)
    ? title
    : `${title} · ${CLIENT_CONFIG.name}`;
  const ldArr = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {ldArr.map((ld, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(ld)}
        </script>
      ))}
    </Helmet>
  );
}
