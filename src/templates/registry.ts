import React from "react";
import DesignOne from "@/components/templates/DesignOne";
import DesignTwo from "@/components/templates/DesignTwo";
import DesignThree from "@/components/templates/DesignThree";
import DesignFour from "@/components/templates/DesignFour";

export interface TemplateAuthor {
  name: string;
  github?: string;
  linkedin?: string;
}

export interface TemplateDefinition {
  id: string;
  name: string;
  description: string;
  category: "Interactive" | "Cinematic" | "Modern Luxe" | "Traditional" | "Minimal";
  badge: string;
  author: TemplateAuthor;
  component: React.ComponentType<{ wedding: any }>;
  isDefault?: boolean;
}

export const TEMPLATE_REGISTRY: Record<string, TemplateDefinition> = {
  "design-one": {
    id: "design-one",
    name: "Royal Journey",
    description: "Interactive narrative cards, avatar pointer, and dynamic blessings.",
    category: "Interactive",
    badge: "Interactive Cards",
    author: {
      name: "Saurav Singh",
      github: "https://github.com/saura-v",
      linkedin: "https://linkedin.com/in/your-profile",
    },
    component: DesignOne,
    isDefault: true,
  },
  "design-two": {
    id: "design-two",
    name: "600vh Cinematic",
    description: "Story-driven continuous vertical scroll with dark palace venue scene.",
    category: "Cinematic",
    badge: "600vh Parallax",
    author: {
      name: "Saurav Singh",
      github: "https://github.com/saura-v",
    },
    component: DesignTwo,
  },
  "design-three": {
    id: "design-three",
    name: "Royal Luxe",
    description: "Opulent typography, gold borders, and smooth multi-section reveals.",
    category: "Modern Luxe",
    badge: "Luxe Heritage",
    author: {
      name: "Community Contributor",
      github: "https://github.com",
    },
    component: DesignThree,
  },
  "design-four": {
    id: "design-four",
    name: "Floating Lotus",
    description: "Ethereal floating lotus petals with smooth animations.",
    category: "Modern Luxe",
    badge: "Floating Elements",
    author: {
      name: "Community Contributor",
      github: "https://github.com",
    },
    component: DesignFour,
  }
};

// Helper Functions
export const getAllTemplates = (): TemplateDefinition[] => {
  return Object.values(TEMPLATE_REGISTRY);
};

export const getTemplate = (id?: string): TemplateDefinition => {
  if (id && TEMPLATE_REGISTRY[id]) {
    return TEMPLATE_REGISTRY[id];
  }
  return TEMPLATE_REGISTRY["design-one"]; // Fallback to default
};