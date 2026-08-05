import { FaJs, FaHtml5, FaCss3Alt, FaReact, FaGitAlt, FaGithub, FaBootstrap } from "react-icons/fa"
import { SiRedux, SiTailwindcss, SiDotnet } from "react-icons/si"
import { DiDotnet, DiDatabase, DiMsqlServer } from "react-icons/di"
import { VscCode } from "react-icons/vsc"
import { TbDatabase, TbBrandVisualStudio, TbBrandCSharp } from "react-icons/tb"

export const iconMap: Record<string, React.ComponentType<any>> = {
  FaJs, FaHtml5, FaCss3Alt, FaReact, FaGitAlt, FaGithub, FaBootstrap,
  SiRedux, SiTailwindcss, SiDotnet,
  DiDotnet, DiDatabase, DiMsqlServer,
  VscCode,
  TbDatabase, TbBrandVisualStudio, TbBrandCSharp,
}
