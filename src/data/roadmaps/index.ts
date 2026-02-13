// This file automatically imports all roadmap files from this directory
// To add a new roadmap: just create a new JSON file in this folder!

import fullstack from './fullstack.json';
import dsa from './dsa.json';
import systemDesign from './system-design.json';
import softSkills from './soft-skills.json';

// Export all roadmaps as an array
export const roadmaps = [
    fullstack,
    dsa,
    systemDesign,
    softSkills,
];

// Export individual roadmaps for direct access
export { fullstack, dsa, systemDesign, softSkills };

// Default export for backward compatibility
export default roadmaps;
