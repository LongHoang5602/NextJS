import MainSlider from "@/components/main/main.slider"
import { sendRequest } from "@/utils/api"
import { Container } from "@mui/material"

export default async function HomePage() {
  const playlistChills = await sendRequest<IBackendRes<ITrackTop[]>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/top`,
    method: "POST",
    body: {
      category: "CHILL",
      limit: 10
    }
  })
  const playlistWorkouts = await sendRequest<IBackendRes<ITrackTop[]>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/top`,
    method: "POST",
    body: {
      category: "WORKOUT",
      limit: 10
    }
  })
  const playlistParty = await sendRequest<IBackendRes<ITrackTop[]>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/top`,
    method: "POST",
    body: {
      category: "PARTY",
      limit: 10
    }
  })
  return (
    <Container>
      <MainSlider title={"Chill Playlist"} data={playlistChills?.data ? playlistChills.data : []} />
      <MainSlider title={"Workout Playlist"} data={playlistWorkouts?.data ? playlistWorkouts.data : []} />
      <MainSlider title={"Party Playlist"} data={playlistParty?.data ? playlistParty.data : []} />
    </Container>
  )
}
