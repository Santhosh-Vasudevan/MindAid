import React, { useState } from 'react';

function Consultants() {
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');

  const consultants = [
    {
      id: 1,
      name: 'Dr. Sarah Mitchell',
      specialty: 'Clinical Psychologist',
      specialtyType: 'psychologist',
      experience: '15 years',
      photo: '👩‍⚕️',
      availability: 'Mon-Fri, 9 AM - 6 PM',
      languages: ['English', 'Spanish'],
      phone: '+1 (555) 123-4567',
      email: 'sarah.mitchell@mindaid.com',
      bio: 'Specializes in anxiety, depression, and trauma-focused therapy. Licensed clinical psychologist with expertise in CBT and EMDR.',
      rating: 4.9,
      sessions: 1200
    },
    {
      id: 2,
      name: 'Dr. James Chen',
      specialty: 'Psychiatrist',
      specialtyType: 'psychiatrist',
      experience: '12 years',
      photo: '👨‍⚕️',
      availability: 'Tue-Sat, 10 AM - 7 PM',
      languages: ['English', 'Mandarin'],
      phone: '+1 (555) 234-5678',
      email: 'james.chen@mindaid.com',
      bio: 'Board-certified psychiatrist specializing in medication management, mood disorders, and holistic mental health care.',
      rating: 4.8,
      sessions: 980
    },
    {
      id: 3,
      name: 'Dr. Emily Rodriguez',
      specialty: 'Marriage & Family Therapist',
      specialtyType: 'therapist',
      experience: '10 years',
      photo: '👩‍💼',
      availability: 'Mon-Thu, 11 AM - 8 PM',
      languages: ['English', 'Spanish', 'Portuguese'],
      phone: '+1 (555) 345-6789',
      email: 'emily.rodriguez@mindaid.com',
      bio: 'Expert in couples therapy, family dynamics, and relationship counseling. Uses evidence-based approaches to strengthen relationships.',
      rating: 5.0,
      sessions: 850
    },
    {
      id: 4,
      name: 'Dr. Michael Thompson',
      specialty: 'Addiction Counselor',
      specialtyType: 'counselor',
      experience: '18 years',
      photo: '👨‍🏫',
      availability: 'Mon-Fri, 8 AM - 5 PM',
      languages: ['English'],
      phone: '+1 (555) 456-7890',
      email: 'michael.thompson@mindaid.com',
      bio: 'Certified addiction specialist with focus on substance abuse, behavioral addictions, and recovery support.',
      rating: 4.7,
      sessions: 1500
    },
    {
      id: 5,
      name: 'Dr. Aisha Patel',
      specialty: 'Child & Adolescent Psychologist',
      specialtyType: 'psychologist',
      experience: '8 years',
      photo: '👩‍🔬',
      availability: 'Wed-Sun, 12 PM - 7 PM',
      languages: ['English', 'Hindi', 'Gujarati'],
      phone: '+1 (555) 567-8901',
      email: 'aisha.patel@mindaid.com',
      bio: 'Specializes in working with children and teens facing anxiety, ADHD, autism spectrum disorders, and behavioral challenges.',
      rating: 4.9,
      sessions: 720
    },
    {
      id: 6,
      name: 'Dr. Robert Williams',
      specialty: 'Trauma Specialist',
      specialtyType: 'psychologist',
      experience: '20 years',
      photo: '👨‍💻',
      availability: 'Mon-Fri, 9 AM - 5 PM',
      languages: ['English', 'French'],
      phone: '+1 (555) 678-9012',
      email: 'robert.williams@mindaid.com',
      bio: 'Expert in PTSD, complex trauma, and crisis intervention. Trained in EMDR, somatic therapy, and trauma-informed care.',
      rating: 4.8,
      sessions: 1350
    }
  ];

  const specialties = [
    { value: 'all', label: 'All Specialties', icon: '🌟' },
    { value: 'psychologist', label: 'Psychologists', icon: '🧠' },
    { value: 'psychiatrist', label: 'Psychiatrists', icon: '💊' },
    { value: 'therapist', label: 'Therapists', icon: '💬' },
    { value: 'counselor', label: 'Counselors', icon: '🤝' }
  ];

  const filteredConsultants = selectedSpecialty === 'all' 
    ? consultants 
    : consultants.filter(c => c.specialtyType === selectedSpecialty);

  const handleBookNow = (consultant) => {
    // For now, just show an alert. In production, this would open a booking modal
    alert(`Booking session with ${consultant.name}\n\nYou can contact them at:\nPhone: ${consultant.phone}\nEmail: ${consultant.email}\n\nA booking confirmation system will be available soon!`);
  };

  return (
    <div className="consultants-page">
      <div className="consultants-header">
        <h1>🩺 Meet Our Consultants</h1>
        <p>Connect with licensed mental health professionals who care</p>
      </div>

      <div className="specialty-filter">
        {specialties.map(specialty => (
          <button
            key={specialty.value}
            className={`specialty-btn ${selectedSpecialty === specialty.value ? 'active' : ''}`}
            onClick={() => setSelectedSpecialty(specialty.value)}
          >
            <span className="specialty-icon">{specialty.icon}</span>
            <span>{specialty.label}</span>
          </button>
        ))}
      </div>

      <div className="consultants-grid">
        {filteredConsultants.map(consultant => (
          <div key={consultant.id} className="consultant-card">
            <div className="consultant-photo">{consultant.photo}</div>
            
            <div className="consultant-info">
              <h3>{consultant.name}</h3>
              <p className="consultant-specialty">{consultant.specialty}</p>
              
              <div className="consultant-stats">
                <div className="stat">
                  <i className="fas fa-star"></i>
                  <span>{consultant.rating} Rating</span>
                </div>
                <div className="stat">
                  <i className="fas fa-users"></i>
                  <span>{consultant.sessions}+ Sessions</span>
                </div>
                <div className="stat">
                  <i className="fas fa-award"></i>
                  <span>{consultant.experience} Exp.</span>
                </div>
              </div>

              <p className="consultant-bio">{consultant.bio}</p>

              <div className="consultant-details">
                <div className="detail-item">
                  <i className="fas fa-clock"></i>
                  <span>{consultant.availability}</span>
                </div>
                <div className="detail-item">
                  <i className="fas fa-language"></i>
                  <span>{consultant.languages.join(', ')}</span>
                </div>
              </div>

              <div className="consultant-contact">
                <div className="contact-item">
                  <i className="fas fa-phone"></i>
                  <a href={`tel:${consultant.phone}`}>{consultant.phone}</a>
                </div>
                <div className="contact-item">
                  <i className="fas fa-envelope"></i>
                  <a href={`mailto:${consultant.email}`}>{consultant.email}</a>
                </div>
              </div>

              <button 
                className="book-now-btn"
                onClick={() => handleBookNow(consultant)}
              >
                <i className="fas fa-calendar-check"></i>
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredConsultants.length === 0 && (
        <div className="no-results">
          <i className="fas fa-search"></i>
          <h3>No consultants found</h3>
          <p>Try selecting a different specialty</p>
        </div>
      )}
    </div>
  );
}

export default Consultants;
