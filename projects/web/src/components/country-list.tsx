import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle } from "./ui/card"
import { ChevronRight } from "lucide-react"

interface Country {
  code: string;
  name: string;
}

interface CountryListProps {
  countries?: Country[];
}

export default function CountryList({ countries = [] }: CountryListProps) {
  return (
    <ul className="grid gap-4 md:grid-cols-2">
      {countries.map(({ code, name }) => (
        <li key={code}>
        <Link to={`/${code}`}>
          <Card className="transition-colors hover:bg-muted/50">
          <div className="flex justify-between items-center"></div>
            <CardHeader className="flex flex-row items-center space-y-0 justify-between">
              <CardTitle className="text-xl font-semibold">{name}</CardTitle>
              <ChevronRight className={`h-4 w-4}`} />
            </CardHeader>
          </Card>
        </Link>
        </li>
      ))}
    </ul>
  )
}
