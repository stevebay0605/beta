import { useState } from 'react';
import { Star, User } from 'lucide-react';
import toast from 'react-hot-toast';

interface Review {
  id: number;
  author: string;
  rating: number;
  comment: string;
  date: string;
  avatar?: string;
}

interface ReviewsSectionProps {
  formationId: number;
}

const MOCK_REVIEWS: Review[] = [
  {
    id: 1,
    author: 'Pierre Mukala',
    rating: 5,
    comment: 'Excellente formation ! Le contenu est très bien structuré et l\'instructeur explique très clairement. Je recommande vivement!',
    date: '2025-11-20',
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: 2,
    author: 'Sophie Tshimanga',
    rating: 4,
    comment: 'Très bonne formation, mais j\'aurais aimé plus de projets pratiques. Le prix est juste pour la qualité offerte.',
    date: '2025-11-15',
    avatar: 'https://i.pravatar.cc/150?img=2',
  },
  {
    id: 3,
    author: 'Marc Kinshasa',
    rating: 5,
    comment: 'Formation complète avec un excellent suivi. Les ressources pédagogiques sont très utiles.',
    date: '2025-11-10',
    avatar: 'https://i.pravatar.cc/150?img=3',
  },
];

export function ReviewsSection({ formationId }: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [author, setAuthor] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!author.trim() || !comment.trim()) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simuler l'envoi de l'avis
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newReview: Review = {
        id: reviews.length + 1,
        author: author.trim(),
        rating,
        comment: comment.trim(),
        date: new Date().toISOString().split('T')[0],
        avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
      };

      setReviews([newReview, ...reviews]);
      setAuthor('');
      setComment('');
      setRating(5);
      setShowForm(false);
      toast.success('Avis publié avec succès!');
    } catch (error) {
      toast.error('Erreur lors de la publication de l\'avis');
    } finally {
      setIsSubmitting(false);
    }
  };

  const averageRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <div className="space-y-8">
      {/* Rating Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="col-span-1">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
            <p className="text-slate-600 text-sm font-semibold mb-2">Note moyenne</p>
            <p className="text-4xl font-black text-[#0055A4] mb-2">{averageRating}</p>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={i < Math.floor(parseFloat(averageRating)) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}
                />
              ))}
            </div>
            <p className="text-sm text-slate-600 mt-2">{reviews.length} avis</p>
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="col-span-1 md:col-span-3">
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = reviews.filter(r => r.rating === stars).length;
              const percentage = (count / reviews.length) * 100;
              return (
                <div key={stars} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 min-w-16">
                    {[...Array(stars)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className="fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-slate-600 min-w-8 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add Review Button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full px-6 py-3 bg-[#0055A4] text-white font-semibold rounded-lg hover:bg-[#0055A4]/90 transition"
        >
          Partager votre avis
        </button>
      )}

      {/* Review Form */}
      {showForm && (
        <form onSubmit={handleSubmitReview} className="bg-slate-50 rounded-lg p-6 border border-slate-200 mb-6">
          <h3 className="text-xl font-bold text-slate-900 mb-4">Partager votre avis</h3>

          {/* Rating Input */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Votre note
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="transition"
                >
                  <Star
                    size={32}
                    className={star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Author Input */}
          <div className="mb-6">
            <label htmlFor="author" className="block text-sm font-semibold text-slate-700 mb-2">
              Votre nom
            </label>
            <input
              id="author"
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Entrez votre nom"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0055A4]"
              required
            />
          </div>

          {/* Comment Input */}
          <div className="mb-6">
            <label htmlFor="comment" className="block text-sm font-semibold text-slate-700 mb-2">
              Votre avis
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Partagez votre expérience avec cette formation..."
              rows={4}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0055A4] resize-none"
              required
            />
          </div>

          {/* Form Actions */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-[#0055A4] text-white font-semibold rounded-lg hover:bg-[#0055A4]/90 transition disabled:opacity-50"
            >
              {isSubmitting ? 'Publication...' : 'Publier l\'avis'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setAuthor('');
                setComment('');
                setRating(5);
              }}
              className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-100 transition"
            >
              Annuler
            </button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-slate-900 mb-6">Avis des utilisateurs</h3>
        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600">Aucun avis pour le moment. Soyez le premier!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="border border-slate-200 rounded-lg p-6 hover:shadow-md transition">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                {review.avatar ? (
                  <img
                    src={review.avatar}
                    alt={review.author}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center">
                    <User size={24} className="text-slate-400" />
                  </div>
                )}

                <div className="flex-1">
                  {/* Author and Date */}
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-slate-900">{review.author}</h4>
                    <span className="text-sm text-slate-500">{review.date}</span>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}
                      />
                    ))}
                  </div>

                  {/* Comment */}
                  <p className="text-slate-700 leading-relaxed">{review.comment}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
