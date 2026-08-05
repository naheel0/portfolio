import { FaJs, FaHtml5, FaCss3Alt, FaReact, FaGitAlt, FaGithub, FaBootstrap, FaMicrosoft } from "react-icons/fa"
import { SiRedux, SiTailwindcss, SiDotnet } from "react-icons/si"
import { DiDotnet, DiDatabase } from "react-icons/di"
import { VscCode } from "react-icons/vsc"
import { TbDatabase } from "react-icons/tb"

export const iconMap: Record<string, React.ComponentType<any>> = {
  FaJs, FaHtml5, FaCss3Alt, FaReact, FaGitAlt, FaGithub, FaBootstrap,
  SiRedux, SiTailwindcss, SiDotnet,
  DiDotnet, DiDatabase,
  VscCode,
  TbDatabase,
  // Seed uses names that don't exist in react-icons — map to fallbacks
  FaCSharp: FaMicrosoft,
  TbBrandMssql: TbDatabase,
  SiVisualstudio: VscCode,
}
