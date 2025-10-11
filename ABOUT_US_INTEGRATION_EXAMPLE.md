# About Us Page - Team Members Integration Example

This guide shows how to integrate the Our Team data from Firestore into your About Us page.

---

## Example React Component

```jsx
import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { motion } from 'framer-motion';

const OurTeamSection = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const q = query(
        collection(db, 'teamMembers'),
        where('visibility', '==', true),
        orderBy('order', 'asc')
      );
      
      const snapshot = await getDocs(q);
      const members = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setTeamMembers(members);
    } catch (error) {
      console.error('Error fetching team members:', error);
    } finally {
      setLoading(false);
    }
  };

  // Optimize Cloudinary image URL
  const getOptimizedImageUrl = (url, width = 400, height = 500) => {
    if (!url) return null;
    return url.replace(
      '/upload/',
      `/upload/w_${width},h_${height},c_fill,f_auto,q_auto/`
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Meet Our Team
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Talented individuals working together to deliver exceptional results
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {/* Image */}
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={getOptimizedImageUrl(member.images[0]?.url)}
                  alt={member.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>

              {/* Info */}
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {member.name}
                </h3>
                <p className="text-gray-600 text-sm">
                  {member.role}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {teamMembers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No team members to display at the moment.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default OurTeamSection;
```

---

## Alternative: Using Real-time Updates

If you want live updates (e.g., for a dashboard), use `onSnapshot`:

```jsx
useEffect(() => {
  const q = query(
    collection(db, 'teamMembers'),
    where('visibility', '==', true),
    orderBy('order', 'asc')
  );
  
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const members = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setTeamMembers(members);
    setLoading(false);
  });

  return () => unsubscribe();
}, []);
```

---

## Cloudinary Transformations Reference

### Basic Optimization
```
/upload/f_auto,q_auto/
```
- `f_auto`: Auto format (WebP, AVIF for modern browsers)
- `q_auto`: Auto quality

### Resize with Aspect Ratio
```
/upload/w_400,h_500,c_fill,f_auto,q_auto/
```
- `w_400`: Width 400px
- `h_500`: Height 500px (maintains 4:5 ratio)
- `c_fill`: Fill mode (crops if needed)

### Responsive Images
```jsx
const getResponsiveImageUrl = (url, size = 'medium') => {
  const sizes = {
    small: 'w_300,h_375',
    medium: 'w_400,h_500',
    large: 'w_600,h_750',
  };
  
  return url.replace(
    '/upload/',
    `/upload/${sizes[size]},c_fill,f_auto,q_auto/`
  );
};
```

### Lazy Loading with Blur Placeholder
```jsx
<img
  src={getOptimizedImageUrl(member.images[0]?.url)}
  alt={member.name}
  loading="lazy"
  className="blur-sm"
  onLoad={(e) => e.target.classList.remove('blur-sm')}
/>
```

---

## Advanced: Skeleton Loading

```jsx
const TeamMemberSkeleton = () => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
    <div className="aspect-[4/5] bg-gray-300"></div>
    <div className="p-6">
      <div className="h-6 bg-gray-300 rounded mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
    </div>
  </div>
);

// In component:
{loading ? (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
    {[...Array(8)].map((_, i) => (
      <TeamMemberSkeleton key={i} />
    ))}
  </div>
) : (
  // ... team members grid
)}
```

---

## SEO Optimization

```jsx
import { Helmet } from 'react-helmet-async'; // or your SEO library

<Helmet>
  <title>Our Team | Enarxi</title>
  <meta name="description" content="Meet the talented team behind Enarxi" />
  <meta property="og:title" content="Our Team | Enarxi" />
  <meta property="og:description" content="Meet the talented team behind Enarxi" />
  {teamMembers[0] && (
    <meta property="og:image" content={getOptimizedImageUrl(teamMembers[0].images[0]?.url)} />
  )}
</Helmet>
```

---

## Accessibility

```jsx
<img
  src={getOptimizedImageUrl(member.images[0]?.url)}
  alt={`${member.name}, ${member.role}`}
  loading="lazy"
  role="img"
  aria-label={`Photo of ${member.name}`}
/>
```

---

## Error Handling

```jsx
const [error, setError] = useState(null);

const fetchTeamMembers = async () => {
  try {
    // ... fetch logic
  } catch (error) {
    console.error('Error fetching team members:', error);
    setError('Failed to load team members. Please try again later.');
  } finally {
    setLoading(false);
  }
};

// In render:
{error && (
  <div className="text-center py-12">
    <p className="text-red-500">{error}</p>
    <button 
      onClick={fetchTeamMembers}
      className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg"
    >
      Retry
    </button>
  </div>
)}
```

---

## Performance Tips

1. **Use `getDocs` for static pages** (About Us)
2. **Use `onSnapshot` for dashboards** (real-time updates needed)
3. **Implement pagination** if you have many team members (>20)
4. **Use Cloudinary transformations** to reduce image size
5. **Enable lazy loading** for images below the fold
6. **Add skeleton loaders** for better perceived performance
7. **Cache data** in localStorage for faster subsequent loads

---

## Example with Pagination

```jsx
const [lastVisible, setLastVisible] = useState(null);
const [hasMore, setHasMore] = useState(true);
const ITEMS_PER_PAGE = 12;

const fetchTeamMembers = async (loadMore = false) => {
  try {
    let q = query(
      collection(db, 'teamMembers'),
      where('visibility', '==', true),
      orderBy('order', 'asc'),
      limit(ITEMS_PER_PAGE)
    );

    if (loadMore && lastVisible) {
      q = query(q, startAfter(lastVisible));
    }

    const snapshot = await getDocs(q);
    const members = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    if (loadMore) {
      setTeamMembers(prev => [...prev, ...members]);
    } else {
      setTeamMembers(members);
    }

    setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
    setHasMore(snapshot.docs.length === ITEMS_PER_PAGE);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    setLoading(false);
  }
};

// Load More button
{hasMore && (
  <button 
    onClick={() => fetchTeamMembers(true)}
    className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg"
  >
    Load More
  </button>
)}
```

---

## Complete Example with All Features

See the main example at the top of this file, which includes:
- ✅ Firestore query with visibility filter
- ✅ Ordered by `order` field
- ✅ Cloudinary optimization
- ✅ Loading state
- ✅ Empty state
- ✅ Framer Motion animations
- ✅ Responsive grid
- ✅ Hover effects
- ✅ Lazy loading

---

**Ready to integrate!** Copy the example component and customize it to match your design system.
