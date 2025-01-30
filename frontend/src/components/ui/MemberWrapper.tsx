import MemberCard from './MemberCard'
import image from '../../assets/image.jpg'

function MemberWrapper() {
  const member = {
    nom: "DUCHERTE",
    prenom: "Yuna",
    quartier: "IVORYIVORYIVORYIVORY",
    numeroCarte: "2649E",
    fin_adhesion: "10/07/2025",
    photo: image,
    codebarre: 9454564564,
   
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <MemberCard member={member} />
    </div>
  )
}

export default MemberWrapper;