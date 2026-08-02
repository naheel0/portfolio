import {
  FaJs, FaHtml5, FaCss3Alt, FaReact, FaGitAlt, FaGithub,
  FaBootstrap, FaDocker, FaNodeJs, FaPython, FaJava,
  FaFigma, FaAws, FaGoogle, FaNpm, FaYarn,
} from "react-icons/fa"
import {
  SiRedux, SiTailwindcss, SiTypescript, SiNextdotjs, SiPrisma,
  SiPostgresql, SiMongodb, SiFirebase, SiGraphql, SiRedis,
  SiDocker, SiVercel, SiNetlify, SiFigma,
} from "react-icons/si"
import { DiDotnet, DiMsqlServer, DiDatabase, DiJava, DiRuby } from "react-icons/di"
import {
  TbDatabase, TbServer, TbBrandVscode, TbBrandVisualStudio,
  TbBrandFirebase, TbBrandDocker, TbBrandAws,
  TbBrandGit, TbBrandGithub, TbBrandReact, TbBrandNodejs,
  TbBrandPython, TbBrandTypescript,
} from "react-icons/tb"

export const iconMap: Record<string, React.ComponentType<any>> = {
  FaJs, FaHtml5, FaCss3Alt, FaReact, FaGitAlt, FaGithub,
  FaBootstrap, FaDocker, FaNodeJs, FaPython, FaJava,
  FaFigma, FaAws, FaGoogle, FaNpm, FaYarn,
  SiRedux, SiTailwindcss, SiTypescript, SiNextdotjs, SiPrisma,
  SiPostgresql, SiMongodb, SiFirebase, SiGraphql, SiRedis,
  SiDocker, SiVercel, SiNetlify, SiFigma,
  DiDotnet, DiMsqlServer, DiDatabase, DiJava, DiRuby,
  TbDatabase, TbServer, TbBrandVscode, TbBrandVisualStudio,
  TbBrandFirebase, TbBrandDocker, TbBrandAws,
  TbBrandGit, TbBrandGithub, TbBrandReact, TbBrandNodejs,
  TbBrandPython, TbBrandTypescript,
}

export const availableIcons = Object.keys(iconMap).sort()
