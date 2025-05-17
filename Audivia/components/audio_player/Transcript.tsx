import { Text } from "react-native"

type TranscriptProps = {
  text: string
}

export default function Transcript({ text }: TranscriptProps) {
  return (
    <>
      <Text style={{ fontSize: 16, lineHeight: 24 }}>{text}</Text>
    </>
  )
}