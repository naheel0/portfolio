import {
  FaJs, FaHtml5, FaCss3Alt, FaReact, FaGitAlt, FaGithub, FaBootstrap, FaCode,
  FaDocker, FaNodeJs, FaPython, FaJava, FaFigma, FaAws, FaGoogle, FaNpm, FaYarn,
  FaUserTie, FaCloud, FaLock, FaUsers,
} from "react-icons/fa"
import {
  SiRedux, SiTailwindcss, SiTypescript, SiNextdotjs, SiPrisma, SiPostgresql,
  SiMongodb, SiFirebase, SiGraphql, SiRedis, SiDocker, SiVercel, SiNetlify,
  SiFigma, SiDotnet, SiVite, SiRazorpay,
} from "react-icons/si"
import { DiDotnet, DiDatabase, DiMsqlServer, DiJava, DiRuby } from "react-icons/di"
import { VscCode } from "react-icons/vsc"
import {
  TbDatabase, TbServer, TbBrandVscode, TbBrandVisualStudio, TbBrandFirebase,
  TbBrandDocker, TbBrandAws, TbBrandGit, TbBrandGithub, TbBrandReact,
  TbBrandNodejs, TbBrandPython, TbBrandTypescript, TbBrandCSharp, TbLock,
} from "react-icons/tb"

export const iconMap: Record<string, React.ComponentType<any>> = {
  FaJs, FaHtml5, FaCss3Alt, FaReact, FaGitAlt, FaGithub, FaBootstrap, FaCode,
  FaDocker, FaNodeJs, FaPython, FaJava, FaFigma, FaAws, FaGoogle, FaNpm, FaYarn,
  FaUserTie, FaCloud, FaLock, FaUsers,
  SiRedux, SiTailwindcss, SiTypescript, SiNextdotjs, SiPrisma, SiPostgresql,
  SiMongodb, SiFirebase, SiGraphql, SiRedis, SiDocker, SiVercel, SiNetlify,
  SiFigma, SiDotnet, SiVite, SiRazorpay,
  DiDotnet, DiDatabase, DiMsqlServer, DiJava, DiRuby,
  VscCode,
  TbDatabase, TbServer, TbBrandVscode, TbBrandVisualStudio, TbBrandFirebase,
  TbBrandDocker, TbBrandAws, TbBrandGit, TbBrandGithub, TbBrandReact,
  TbBrandNodejs, TbBrandPython, TbBrandTypescript, TbBrandCSharp, TbLock,
}

export const DefaultIcon = FaCode;
