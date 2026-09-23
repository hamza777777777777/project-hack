import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { mockRooms } from '@/data/mock-rooms'
import { Camera, Users, Check, Maximize2 } from 'lucide-react'

export const Route = createFileRoute('/_layout/rooms-360')({
  component: Rooms360Page,
})

function Rooms360Page() {
  const rooms = mockRooms

  return (
    <div className="p-6 space-y-6 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">360&deg; Room Explorer</h1>
        <p className="text-muted-foreground">Virtually tour our rooms before booking.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {rooms.map((room) => (
          <Card key={room.id} className="overflow-hidden flex flex-col">
            <div className="relative aspect-video bg-muted group">
              <img 
                src={room.thumbnail} 
                alt={room.name} 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="secondary" className="gap-2">
                      <Camera className="w-4 h-4" /> View 360&deg; Tour
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl w-[90vw] h-[80vh] flex flex-col">
                    <DialogHeader>
                      <DialogTitle>{room.name}</DialogTitle>
                      <DialogDescription>Interactive 360-degree view (Placeholder)</DialogDescription>
                    </DialogHeader>
                    <div className="flex-1 bg-zinc-900 rounded-md relative overflow-hidden flex items-center justify-center border group/viewer cursor-pointer">
                      {/* Pannellum Placeholder */}
                      <div className="text-zinc-500 flex flex-col items-center gap-2">
                        <Maximize2 className="h-12 w-12 opacity-50" />
                        <p>Pannellum Viewer will load here.</p>
                        <p className="text-xs opacity-60">Requires backend integration for equirectangular images.</p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              {!room.available && (
                <div className="absolute top-2 right-2">
                  <Badge variant="destructive">Sold Out</Badge>
                </div>
              )}
            </div>
            
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{room.name}</CardTitle>
                  <CardDescription>{room.type}</CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">₹{room.price.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">per night</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {room.description}
              </p>
              
              <div className="flex items-center text-sm">
                <Users className="w-4 h-4 mr-2 text-muted-foreground" />
                Up to {room.capacity} Guests
              </div>
              
              <div className="space-y-2">
                <div className="text-sm font-medium">Amenities</div>
                <div className="flex flex-wrap gap-1">
                  {room.amenities.map(a => (
                    <Badge key={a} variant="secondary" className="text-xs font-normal">
                      <Check className="w-3 h-3 mr-1 text-green-500" /> {a}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button className="w-full" disabled={!room.available}>
                {room.available ? 'Book Now' : 'Not Available'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
