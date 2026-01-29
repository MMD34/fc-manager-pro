import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import type { CreateCareerInput } from '@/types/career.types'

const createCareerSchema = z.object({
  club_name: z.string().min(2, 'Club name is required'),
  league_name: z.string().min(2, 'League name is required'),
  manager_name: z.string().min(2, 'Manager name is required'),
  country: z.string().optional(),
  difficulty: z.string().optional(),
  current_season: z
    .preprocess((value) => (value === '' ? undefined : Number(value)), z.number().int().min(1).optional()),
  budget: z
    .preprocess((value) => (value === '' ? undefined : Number(value)), z.number().min(0).optional()),
})

type CreateCareerForm = z.infer<typeof createCareerSchema>

interface CreateCareerModalProps {
  isOpen: boolean
  isSubmitting?: boolean
  onClose: () => void
  onSubmit: (input: CreateCareerInput) => Promise<void>
}

export default function CreateCareerModal({
  isOpen,
  isSubmitting,
  onClose,
  onSubmit,
}: CreateCareerModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateCareerForm>({
    resolver: zodResolver(createCareerSchema),
    defaultValues: {
      current_season: 1,
      budget: 10000000,
    },
  })

  const handleClose = () => {
    reset()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900/80 p-6 shadow-xl backdrop-blur-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-100">Create New Career</h2>
          <button onClick={handleClose} className="rounded-full px-2 py-1 text-slate-300 hover:bg-white/10">
            ✕
          </button>
        </div>
        <form
          onSubmit={handleSubmit(async (data) => {
            await onSubmit({
              club_name: data.club_name,
              league_name: data.league_name,
              manager_name: data.manager_name,
              country: data.country || undefined,
              difficulty: data.difficulty || undefined,
              current_season: data.current_season,
              budget: data.budget,
            })
            reset()
          })}
          className="space-y-4"
        >
          <Input label="Club Name" error={errors.club_name?.message} {...register('club_name')} />
          <Input label="League Name" error={errors.league_name?.message} {...register('league_name')} />
          <Input label="Manager Name" error={errors.manager_name?.message} {...register('manager_name')} />
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Country" {...register('country')} />
            <Input label="Difficulty" {...register('difficulty')} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Current Season" type="number" {...register('current_season')} />
            <Input label="Budget" type="number" {...register('budget')} />
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="ghost" className="flex-1" type="button" onClick={handleClose}>
              Cancel
            </Button>
            <Button className="flex-1" type="submit" isLoading={isSubmitting}>
              Create
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
