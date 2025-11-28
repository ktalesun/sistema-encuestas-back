import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Usuario } from '../../usuario/entities/usuario.entity';

@Entity('roles')
export class Rol {
  @PrimaryGeneratedColumn('uuid')
  id_rol: string;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'jsonb', nullable: true })
  permisos: string[]; // Array de permisos

  @OneToMany(() => Usuario, (usuario) => usuario.rol)
  usuarios: Usuario[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
