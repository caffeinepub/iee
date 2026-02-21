import { Skill } from '../backend';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Card, CardContent } from './ui/card';

interface SkillsMultiSelectProps {
  selectedSkills: Skill[];
  onChange: (skills: Skill[]) => void;
}

const skillLabels: Record<Skill, string> = {
  masonry: 'Masonry',
  plumbing: 'Plumbing',
  electrician: 'Electrician',
  carpentry: 'Carpentry',
  painting: 'Painting',
  roofing: 'Roofing',
  flooring: 'Flooring',
  tiling: 'Tiling',
  welding: 'Welding',
  generalLabor: 'General Labor',
};

export default function SkillsMultiSelect({ selectedSkills, onChange }: SkillsMultiSelectProps) {
  const handleToggle = (skill: Skill) => {
    if (selectedSkills.includes(skill)) {
      onChange(selectedSkills.filter((s) => s !== skill));
    } else {
      onChange([...selectedSkills, skill]);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(skillLabels).map(([skill, label]) => (
            <div key={skill} className="flex items-center space-x-2">
              <Checkbox
                id={skill}
                checked={selectedSkills.includes(skill as Skill)}
                onCheckedChange={() => handleToggle(skill as Skill)}
              />
              <Label htmlFor={skill} className="cursor-pointer font-normal">
                {label}
              </Label>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
