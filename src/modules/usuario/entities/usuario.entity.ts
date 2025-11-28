import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Empresa } from '../../empresa/entities/empresa.entity';
import { Rol } from '../../rol/entities/rol.entity';
import { Respuesta } from '../../respuesta/entities/respuesta.entity';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id_usuario: string;

  @Column({ type: 'varchar', length: 255 })
  nombre: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 20, default: 'activo' })
  estado: string; // activo | inactivo

  @ManyToOne(() => Empresa, (empresa) => empresa.usuarios)
  @JoinColumn({ name: 'empresa_id' })
  empresa: Empresa;

  @Column({ type: 'uuid' })
  empresa_id: string;

  @ManyToOne(() => Rol, (rol) => rol.usuarios)
  @JoinColumn({ name: 'rol_id' })
  rol: Rol;

  @Column({ type: 'uuid', nullable: true })
  rol_id: string;

  @OneToMany(() => Respuesta, (respuesta) => respuesta.usuario)
  respuestas: Respuesta[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
