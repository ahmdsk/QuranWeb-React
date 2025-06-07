import { ChangeEvent } from 'react'
import { Search } from 'lucide-react'
import { Input } from '../ui/input'

interface InputSearchHomeProps {
  value: string
  onChange: (value: string) => void
}

const InputSearchHome = ({ value, onChange }: InputSearchHomeProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  return (
    <div className="relative">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Cari surah..."
        value={value}
        onChange={handleChange}
        className="pl-8"
      />
    </div>
  )
}

export default InputSearchHome 